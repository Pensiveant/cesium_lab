class SceneView {
  constructor(options) {
    const { container } = options;
    let viewer = new Cesium.Viewer(container, {
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

      ...options,
    });

    viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
    return viewer;
  }
}

export default SceneView;
