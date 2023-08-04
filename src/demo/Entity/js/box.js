// const Cesium = require("cesium"); // 智能提示使用

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
  // 使用ArcGIS 底图
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  }),
  terrain: Cesium.Terrain.fromWorldTerrain(),
});
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
viewer.scene.globe.depthTestAgainstTerrain = true;

const centerPoint = [104.06335998805471, 30.659858531850176, 500]; // 中心点的经度、纬度、高程
const point = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint[0],
    centerPoint[1],
    centerPoint[2]
  ),
  point: {
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  },
});
viewer.entities.add(point);

// 长方体
const boxEntity = viewer.entities.add({
  name: "box",
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint[0],
    centerPoint[1],
    centerPoint[2]
  ),
  box: {
    dimensions: new Cesium.Cartesian3(100.0, 100.0, 50.0), // 长 、宽、高
    material: Cesium.Color.GREEN.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.YELLOW,
  },
});

viewer.flyTo(boxEntity, {
  duration: 1, // 以秒为单位的飞行持续时间。
  offset: {
    heading: Cesium.Math.toRadians(0.0), // 以弧度为单位的航向角。
    pitch: -Math.PI / 2, // 以弧度为单位的俯仰角。
    range: 300, // 到中心的距离，以米为单位。
  },
});
