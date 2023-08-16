// const Cesium = require("cesium"); // 智能提示使用
import KDBush from "https://cdn.jsdelivr.net/npm/kdbush/+esm";
import writeTextToCanvas from "./writeTextToCanvas.js";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYzVkMTc1ZS00NTRhLTRjY2QtYTQwZS01YmU2Mjg1ODAwN2YiLCJpZCI6MjU5LCJpYXQiOjE2ODgzOTgwMjl9.MZC_HUBRd0y5HJeB-F5QSpT-fEgTM6mI5gMaSND9FHc";

// 初始化view
const viewer = new Cesium.Viewer("cesiumContainer", {
  geocoder: false, // 搜索功能
  homeButton: false, // home
  sceneModePicker: false, // 隐藏二三维切换
  baseLayerPicker: false, //隐藏默认底图选择控件
  navigationHelpButton: false, // 帮助？号
  animation: false,
  infoBox: false,
  timeline: false,
  fullscreenButton: false,
  terrain: Cesium.Terrain.fromWorldTerrain(),
  // 使用ArcGIS 底图
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  }),
});
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo

// 加载Geojson：点
let pointGeojson = Cesium.GeoJsonDataSource.load("./data/tianhe.geojson", {
  markerSize: 30, // 点大小
  markerColor: Cesium.Color.RED, // 点颜色
  markerSymbol: "village", // 点样式， 参考： https://sandcastle.cesium.com/index.html?src=GeoJSON%2520simplestyle.html
}).then((dataSource) => {
  viewer.dataSources.add(dataSource);
  // 修改默认的点样式
  var entities = dataSource.entities.values;
  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];

    entity.point = new Cesium.PointGraphics({
      color: Cesium.Color.RED,
      pixelSize: 1,
    });
    const canvas = writeTextToCanvas(entity._name, {
      font: "20px sans-serif",
    });
    entity.billboard.image = canvas;
    entity.billboard.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
    entity.billboard.verticalOrigin = Cesium.VerticalOrigin.CENTER;
    entity.billboard.width = canvas.width;
    entity.billboard.height = canvas.height;
  }
  viewer.flyTo(dataSource);
  let test = new LabelAvoid({ viewer, dataSource });
});

//#region 注记避让

class LabelAvoid {
  constructor(options) {
    this.dataSource = options.dataSource;
    this.viewer = options.viewer;
    this.setAvoidLalelOverlap();
  }

  setAvoidLalelOverlap() {
    let dataSource = this.dataSource;
    const that = this;
    this._removeEventListener = this.viewer.camera.changed.addEventListener(
      () => {
        const entities = dataSource.entities.values;
        that.avoidLalelOverlap(entities, 10, 10); // 上下左右空半个字大小
      }
    );
  }
  avoidLalelOverlap(entities, offsetX = 0, offsetY = 0) {
    if (!entities || entities.length === 0) {
      return;
    }
    //转换为平面坐标
    const points = [];
    for (let i = 0; i < entities.length; i++) {
      const item = entities[i];
      const coord = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(
        viewer.scene,
        item.position._value
      );
      if (coord) {
        points.push({
          index: i,
          entity: item,
          coord, // 屏幕坐标
          hide: false, // 是否隐藏
        });
      }
    }

    const index = new KDBush(points.length, 64, Uint32Array);
    for (let i = 0; i < points.length; i++) {
      index.add(points[i].coord.x, points[i].coord.y);
    }
    index.finish();

    for (let i = 0; i < entities.length; i++) {
      const item = entities[i];
      item.billboard.show = true;
    }

    // 遮挡检测
    for (let i = 0; i < points.length; i++) {
      const target = points[i];
      if (target.hide) {
        continue;
      }
      //   const bbox = target.coord;
      const bbox = this.getScreenSpaceBoundingBox(
        target.entity.billboard,
        target.coord
      );

      const range = {
        minx: 0,
        miny: 0,
        maxx: 0,
        maxy: 0,
      };
      const verticalOrigin = target.entity.billboard.verticalOrigin._value
        ? target.entity.billboard.verticalOrigin._value
        : Cesium.VerticalOrigin.CENTER;
      if (verticalOrigin === Cesium.VerticalOrigin.TOP) {
        range.miny = bbox.y - offsetY;
        range.maxy = bbox.y + bbox.height + offsetY;
      } else if (verticalOrigin === Cesium.VerticalOrigin.CENTER) {
        range.miny = bbox.y - bbox.height / 2 - offsetY;
        range.maxy = bbox.y + bbox.height / 2 + offsetY;
      } else if (
        verticalOrigin === Cesium.VerticalOrigin.BASELINE ||
        verticalOrigin === Cesium.VerticalOrigin.BOTTOM
      ) {
        range.miny = bbox.y - bbox.height - offsetY;
        range.maxy = bbox.y + bbox.height + offsetY;
      }

      const horizontalOrigin = target.entity.billboard.horizontalOrigin
        ? target.entity.billboard.horizontalOrigin._value
        : Cesium.HorizontalOrigin.CENTER;
      if (horizontalOrigin === Cesium.HorizontalOrigin.CENTER) {
        range.minx = bbox.x - bbox.width / 2 - offsetX;
        range.maxx = bbox.x + bbox.width / 2 + offsetX;
      } else if (horizontalOrigin === Cesium.HorizontalOrigin.LEFT) {
        range.minx = bbox.x - offsetX;
        range.maxx = bbox.x + bbox.width + offsetX;
      } else if (horizontalOrigin === Cesium.HorizontalOrigin.RIGHT) {
        range.minx = bbox.x - bbox.width - offsetX;
        range.maxx = bbox.x + offsetX;
      }

      const neighbors = index.range(
        range.minx,
        range.miny,
        range.maxx,
        range.maxy
      );

      let startIndex = offsetX === 0 ? 0 : 1; // offsetX不为0时，自己也会被包含在内，如果隐藏，将全部看不见
      for (let j = startIndex; j < neighbors.length; j++) {
        const neighborsPoint = points[neighbors[j]];
        neighborsPoint.entity.billboard.show = false;
        neighborsPoint.hide = true;
      }
    }
  }

  getScreenSpaceBoundingBox(billboard, screenSpacePosition, result) {
    let width = billboard.width;
    let height = billboard.height;

    const scale = billboard.scale ?? 1;
    width *= scale;
    height *= scale;

    let x = screenSpacePosition.x;
    let horizontalOrigin =
      billboard.horizontalOrigin ?? Cesium.HorizontalOrigin.CENTER;
    if (horizontalOrigin === Cesium.HorizontalOrigin.RIGHT) {
      x -= width;
    } else if (horizontalOrigin === Cesium.HorizontalOrigin.CENTER) {
      x -= width * 0.5;
    }

    let y = screenSpacePosition.y;
    let verticalOrigin =
      billboard.verticalOrigin ?? Cesium.VerticalOrigin.CENTER;
    if (
      verticalOrigin === Cesium.VerticalOrigin.BOTTOM ||
      verticalOrigin === Cesium.VerticalOrigin.BASELINE
    ) {
      y -= height;
    } else if (verticalOrigin === Cesium.VerticalOrigin.CENTER) {
      y -= height * 0.5;
    }

    if (!Cesium.defined(result)) {
      result = new Cesium.BoundingRectangle();
    }

    result.x = x;
    result.y = y;
    result.width = width;
    result.height = height;

    return result;
  }
}
window.LabelAvoid = LabelAvoid;
//#endregion
