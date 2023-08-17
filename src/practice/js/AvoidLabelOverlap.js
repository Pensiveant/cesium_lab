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

    // // entity为label
    // entity.billboard.show = false;
    // entity.label = {
    //   text: entity._name,
    //   font: "20px sans-serif",
    // };

    // entity 为billboard
    entity.billboard.show = true;
    const canvas = writeTextToCanvas(entity._name, {
      font: "20px sans-serif",
    });
    entity.billboard.image = canvas;
    entity.billboard.horizontalOrigin = Cesium.HorizontalOrigin.LEFT;
    entity.billboard.verticalOrigin = Cesium.VerticalOrigin.TOP;
    entity.billboard.width = canvas.width;
    entity.billboard.height = canvas.height;
  }
  viewer.flyTo(dataSource);
  let labelAvoid = new LabelAvoid({
    viewer,
    dataSource,
    offsetX: 10,
    offsetY: 10,
  });
});

//#region 注记避让

class LabelAvoid {
  constructor(options) {
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
    this.dataSource = options.dataSource;
    this.viewer = options.viewer;
    this.offsetX = Cesium.defaultValue(options.offsetX, 0); // X轴，左右偏移量
    this.offsetY = Cesium.defaultValue(options.offsetY, 0); // Y轴，上下偏移量
    this._removeEventListener = undefined;
    this._initialize();
  }

  _initialize() {
    this.setAvoidLalelOverlap();
  }

  setAvoidLalelOverlap() {
    if (this._removeEventListener) {
      this._removeEventListener();
    }
    
    let dataSource = this.dataSource;
    const that = this;
    this._removeEventListener = this.viewer.camera.changed.addEventListener(
      () => {
        const entities = dataSource.entities.values;
        let entityType =
          entities[0].label && entities[0].label.text._value.length > 0
            ? "label"
            : "billboard";
        that.avoidLalelOverlap(
          entities,
          this.offsetX,
          this.offsetY,
          entityType
        ); // 上下左右空半个字大小
      }
    );
  }

  /**
   *
   * @param {*} entities
   * @param {*} offsetX
   * @param {*} offsetY
   * @param {*} entityType
   * @returns
   */
  avoidLalelOverlap(entities, offsetX, offsetY, entityType = "billboard") {
    if (!entities || entities.length === 0) {
      return;
    }
    //转换为平面坐标
    const points = [];
    for (let i = 0; i < entities.length; i++) {
      const item = entities[i];
      const coord = Cesium.SceneTransforms.wgs84ToDrawingBufferCoordinates(
        this.viewer.scene,
        item.position._value
      );

      //#region 将所有平面坐标，移动到左中点。
      const billboard = item.billboard;
      let width = 0;
      let height = 0;
      if (entityType === "billboard") {
        width = billboard.width;
        height = billboard.height;
        const scale = billboard.scale ?? 1;
        width *= scale;
        height *= scale;
      }
      if (entityType === "label") {
        const canvas = writeTextToCanvas(item.label.text._value, {
          font: item.label.font._value,
        });
        width = canvas.width;
        height = canvas.height;
        item.label.width = width;
        item.label.height = height;
      }

      let x = coord.x;
      const horizontalOrigin = billboard.horizontalOrigin
        ? billboard.horizontalOrigin._value
        : Cesium.HorizontalOrigin.CENTER;
      if (horizontalOrigin === Cesium.HorizontalOrigin.RIGHT) {
        x = x - width; // x坐标全部转换到左边进行判断
      } else if (horizontalOrigin === Cesium.HorizontalOrigin.CENTER) {
        x = x - width / 2;
      }

      let y = coord.y;
      const verticalOrigin = billboard.verticalOrigin._value
        ? billboard.verticalOrigin._value
        : Cesium.VerticalOrigin.CENTER;
      if (
        verticalOrigin === Cesium.VerticalOrigin.BOTTOM ||
        verticalOrigin === Cesium.VerticalOrigin.BASELINE
      ) {
        y = y - height / 2; //  y坐标全部转换到中间位置
      } else if (verticalOrigin === Cesium.VerticalOrigin.TOP) {
        y = y + height / 2;
      }
      //#endregion

      if (coord) {
        points.push({
          index: i,
          entity: item,
          coord: {
            x,
            y,
          }, // 屏幕坐标
          hide: false, // 是否隐藏
        });
      }
    }

    const index = new KDBush(points.length, 64, Uint32Array);
    for (let i = 0; i < points.length; i++) {
      index.add(points[i].coord.x, points[i].coord.y);
    }
    index.finish();

    // 避让前，全部显示
    for (let i = 0; i < entities.length; i++) {
      const item = entities[i];
      if (entityType === "billboard") {
        item.billboard.show = true;
      } else if (entityType === "label") {
        item.label.show = true;
      }
    }

    // 遮挡检测
    for (let i = 0; i < points.length; i++) {
      const target = points[i];
      if (target.hide) {
        continue;
      }

      // 获取范围框
      let range;
      if (entityType === "billboard") {
        range = this.getScreenSpaceBoundingBox(
          target.entity.billboard,
          target.coord,
          offsetX,
          offsetY
        );
      }
      if (entityType === "label") {
        range = this.getScreenSpaceBoundingBox(
          target.entity.label,
          target.coord,
          offsetX,
          offsetY
        );
      }

      const neighbors = index.range(
        range.minx,
        range.miny,
        range.maxx,
        range.maxy
      );

      for (let j = 0; j < neighbors.length; j++) {
        const neighborsPoint = points[neighbors[j]];
        if (
          target.coord.x === neighborsPoint.coord.x &&
          target.coord.y === neighborsPoint.coord.y
        ) {
          continue;
        }

        if (entityType === "billboard") {
          neighborsPoint.entity.billboard.show = false;
        } else if (entityType === "label") {
          neighborsPoint.entity.label.show = false;
        }
        neighborsPoint.hide = true;
      }
    }
  }

  /**
   *
   * @param {*} billboard||Label
   * @param {*} screenSpacePosition
   * @param {*} offsetX
   * @param {*} offsetY
   * @returns
   */
  getScreenSpaceBoundingBox(
    billboard,
    screenSpacePosition,
    offsetX = 0,
    offsetY = 0
  ) {
    let minx = 0;
    let maxx = 0;
    let miny = 0;
    let maxy = 0;

    let width = billboard.width;
    let height = billboard.height;
    const scale = billboard.scale ?? 1;
    width *= scale;
    height *= scale;

    let x = screenSpacePosition.x;
    minx = x - offsetX;
    maxx = x + width + offsetX;

    let y = screenSpacePosition.y;
    miny = y - height - offsetY;
    maxy = y + height + offsetY;
    return { minx, maxx, miny, maxy };
  }

  destroy() {
    const entities = this.dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      const item = entities[i];
      if (item.billboard) {
        item.billboard.show = true;
      }

      if (item.label) {
        item.label.show = true;
      }
    }

    if (this._removeEventListener) {
      this._removeEventListener();
    }
  }
}
window.LabelAvoid = LabelAvoid;
//#endregion
