Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0YjhlOGM0Yy0xNzcwLTQwNWEtODk4Yy0xMGJkODg4MTA5ZGEiLCJpZCI6MjU5LCJpYXQiOjE3MTc0MzM4NjB9.VwBpSnRTNdg_G6uvU-JNsRNcSOCDMKW_j3Nl5E7wfwg";

function createViewer(contanier = "cesiumContainer", showTerrain = true) {
  let config = {
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
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
      Cesium.ArcGisMapServerImageryProvider.fromUrl(
        "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
      )
    ),
  };
  if (showTerrain) {
    config = {
      ...config,
      terrain: Cesium.Terrain.fromWorldTerrain(),
    };
  }
  // 初始化view
  const viewer = new Cesium.Viewer(contanier, config);
  viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
  viewer.scene.globe.depthTestAgainstTerrain = true;
  return viewer;
}

export default createViewer;
