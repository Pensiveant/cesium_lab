// const Cesium = require("cesium"); // 智能提示使用

Cesium.Ion.defaultAccessToken = defaultAccessToken;
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

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    103.66553274314929,
    31.341147649314625,
    5000
  ),
});

// 设置等高线样式
let globe = viewer.scene.globe;
let material = new Cesium.Material.fromType("ElevationContour", {
  color: Cesium.Color.RED,
  spacing: 100, // 等高线间距（米）
  width: 3,  // 等高线宽度
});
globe.material = material;
