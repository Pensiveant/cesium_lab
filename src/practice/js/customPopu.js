// const Cesium = require("cesium"); // 智能提示使用
import { FloatInfoBox } from "./tools.js";

// 初始化view
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYzVkMTc1ZS00NTRhLTRjY2QtYTQwZS01YmU2Mjg1ODAwN2YiLCJpZCI6MjU5LCJpYXQiOjE2ODgzOTgwMjl9.MZC_HUBRd0y5HJeB-F5QSpT-fEgTM6mI5gMaSND9FHc";
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
  selectionIndicator: false // 去除选中的绿色框
  // terrain: Cesium.Terrain.fromWorldTerrain(),
});
let baseMap = Cesium.ImageryLayer.fromProviderAsync(
  Cesium.ArcGisMapServerImageryProvider.fromUrl(
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
  )
);
viewer.imageryLayers.add(baseMap);

loadPopuPoint(viewer);

const moveEventHandler = new Cesium.ScreenSpaceEventHandler(
  viewer.scene.canvas
);
moveEventHandler.setInputAction(function (evt) {
  let entity = viewer.scene.pick(evt.endPosition);
  if (entity) {
    viewer.scene.canvas.style.cursor = "pointer";
  } else {
    viewer.scene.canvas.style.cursor = "default";
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

const eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
eventHandler.setInputAction(function (evt) {
  let entity = viewer.scene.pick(evt.position);
  if (entity) {
    // that.showPopu = true;
    let divlayer2 = new FloatInfoBox(viewer);
    divlayer2.add(
      document.getElementById("popubox"),
      entity.primitive.position,
      { yoffset: 10 }
    );
    viewer.flyTo(entity.id, {
      offset: new Cesium.HeadingPitchRange(0, -45, 7000),
    });
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

// 加载Geojson：点
async function loadPopuPoint(viewer) {
  let pointGeojson = Cesium.GeoJsonDataSource.load("./data/popu.geojson", {
    markerSize: 30, // 点大小
    markerColor: Cesium.Color.RED, // 点颜色
    markerSymbol: "village", // 点样式， 参考： https://sandcastle.cesium.com/index.html?src=GeoJSON%2520simplestyle.html
  }).then((dataSource) => {
    viewer.dataSources.add(dataSource);
    viewer.flyTo(dataSource.entities);
    // 修改默认的点样式
    var entities = dataSource.entities.values;
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      entity.billboard = undefined;
      entity.point = new Cesium.PointGraphics({
        color: Cesium.Color.RED,
        pixelSize: 10,
      });
    }
  });
}
