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


// 贴地线
let positions = Cesium.Cartesian3.fromDegreesArrayHeights([
  103.41379723678328, 31.375143364748766, 3438.488460762016,
  103.4169866667712, 31.376088888150846, 3502.064310647249,
  103.41488588889774, 31.37685799149146, 3583.6991989346106
]);
let polylineGeometry = new Cesium.GroundPolylineGeometry({
  positions,
  width: 5,       // 线宽
});

let polygonPrimitive = new Cesium.GroundPolylinePrimitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: polylineGeometry,
  }),
  appearance: new Cesium.PolylineMaterialAppearance()
});
viewer.scene.primitives.add(polygonPrimitive);


// 线
let positions1 = Cesium.Cartesian3.fromDegreesArrayHeights([
  103.40676529505363, 31.3690949695172, 2884.541051100123,
  103.42301663279521, 31.366145166370586, 3098.2252663474646,
  103.4093535650738, 31.373415863161433, 3155.7575828735485
]);
let polylineGeometry1= new Cesium.PolylineGeometry({
  positions:positions1,
  width: 5,       // 线宽
});

let polygonPrimitive1 = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: polylineGeometry1,
  }),
  appearance: new Cesium.PolylineMaterialAppearance()
});
viewer.scene.primitives.add(polygonPrimitive1);


viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    103.41379723678328, 31.375143364748766, 4400
  ),
});
