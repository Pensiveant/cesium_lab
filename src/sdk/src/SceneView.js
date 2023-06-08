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

    viewer.map = options?.map;
    viewer.map._viewer = viewer;
    this._modifyMouseAction(viewer);
    return viewer;
  }

  /**
   * 修改鼠标操作的默认行为（左键：移动；右键：放大缩小；中键：旋转）
   * @param {*} viewer
   */
  _modifyMouseAction(viewer) {
    //修改旋转为右键操作
    viewer.scene.screenSpaceCameraController.tiltEventTypes = [
      Cesium.CameraEventType.RIGHT_DRAG,
      Cesium.CameraEventType.PINCH,
      {
        eventType: Cesium.CameraEventType.LEFT_DRAG,
        modifier: Cesium.KeyboardEventModifier.CTRL,
      },
      {
        eventType: Cesium.CameraEventType.RIGHT_DRAG,
        modifier: Cesium.KeyboardEventModifier.CTRL,
      },
    ];
    // 重置地图放大缩小操作，
    viewer.scene.screenSpaceCameraController.zoomEventTypes = [
      Cesium.CameraEventType.MIDDLE_DRAG,
      Cesium.CameraEventType.WHEEL,
      Cesium.CameraEventType.PINCH,
    ];

    //移除默认鼠标左键双击事件
    viewer.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
  }
}

export default SceneView;
