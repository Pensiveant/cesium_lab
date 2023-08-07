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


// 加载矩形
const rectanglePrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(
        104.06659151481527,
        30.648006045014633,
        104.06912063115297,
        30.648898281515343
      ),
      height: 500,    // 高度
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
    }),
  }),
  appearance: new Cesium.EllipsoidSurfaceAppearance({
    material: new Cesium.Material.fromType("Color", {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
    }),
  }),
});
viewer.scene.primitives.add(rectanglePrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06659151481527,
    30.648006045014633,
    1500
  ),
});
