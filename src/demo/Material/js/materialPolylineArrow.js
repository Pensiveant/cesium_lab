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
  // terrain: Cesium.Terrain.fromWorldTerrain(),
});
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
viewer.scene.globe.depthTestAgainstTerrain = true;

// 线
let positions = Cesium.Cartesian3.fromDegreesArray([
  104.06204432699153, 30.660726592602778, 104.06491131775273,
  30.660792356429575, 104.06488421424214, 30.65902970314711, 104.06206037235002,
  30.65901615923885,
]);
let polylineGeometry = new Cesium.PolylineGeometry({
  positions,
  width: 10.0,
  vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
});

let polylinePrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: polylineGeometry,
  }),
  appearance: new Cesium.PolylineMaterialAppearance({
    material: new Cesium.Material.fromType("PolylineArrow", {
      color: Cesium.Color.RED,
    }),
  }),
});
viewer.scene.primitives.add(polylinePrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06204432699153,
    30.660726592602778,
    1500
  ),
});
