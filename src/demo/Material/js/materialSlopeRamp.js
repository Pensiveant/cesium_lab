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
  terrain: Cesium.Terrain.fromWorldTerrain({
    requestVertexNormals: true, //Needed to visualize slope
  }),
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

const elevationRamp = [0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0];
const slopeRamp = [0.0, 0.29, 0.5, Math.sqrt(2) / 2, 0.87, 0.91, 1.0];
const aspectRamp = [0.0, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0];
function getColorRamp(selectedShading) {
  const ramp = document.createElement("canvas");
  ramp.width = 100;
  ramp.height = 1;
  const ctx = ramp.getContext("2d");

  let values;
  if (selectedShading === "elevation") {
    values = elevationRamp;
  } else if (selectedShading === "slope") {
    values = slopeRamp;
  } else if (selectedShading === "aspect") {
    values = aspectRamp;
  }

  const grd = ctx.createLinearGradient(0, 0, 100, 0);
  grd.addColorStop(values[0], "#000000"); //black
  grd.addColorStop(values[1], "#2747E0"); //blue
  grd.addColorStop(values[2], "#D33B7D"); //pink
  grd.addColorStop(values[3], "#D33038"); //red
  grd.addColorStop(values[4], "#FF9742"); //orange
  grd.addColorStop(values[5], "#ffd700"); //yellow
  grd.addColorStop(values[6], "#ffffff"); //white

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 100, 1);

  return ramp;
}

let material = new Cesium.Material.fromType("SlopeRamp", {
  image: getColorRamp("slope"),
  // image: "./img/snow.webp",
});
globe.material = material;
