// const Cesium = require("cesium"); // 智能提示使用

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
  // 使用ArcGIS 底图
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  }),
  terrain: Cesium.Terrain.fromWorldTerrain(),
});
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
window.viewer = viewer;

// 加载白模
let customShader = new Cesium.CustomShader({
  // 
  fragmentShaderText: `                
  void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
    material.diffuse = vec3(255,0,0)+ vec3(255,0,0)*1.0;     // 只设置入反射为红色，则模型显示为红色
    // material.emissive = vec3(0,255,0);
    // material.occlusion = 0.0;
}`,
});
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343);
tileset.customShader = customShader;
window.tileset = tileset;
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);
