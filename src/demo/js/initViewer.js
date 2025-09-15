Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NTEwZTU2Yi0wOGEyLTQyZjgtOTJjNi04Mzc2NGRlNzA4NTkiLCJpZCI6MjU5LCJpYXQiOjE3NTY4NDExOTJ9._Y3MIsYgGKTVTpkEpKPNT0cQSa_hUocY0DdH7h0U-xM";
function createViewer(options = {}) {
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
    ...options,
  };

  // 设置容器：
  let contanier = options.contanier ?? "cesiumContainer";

  // 初始化view
  const viewer = new Cesium.Viewer(contanier, config);

  // 是否显示地形：
  let showTerrain = options.showTerrain ?? true;
  if (showTerrain) {
    // CesiumTerrainProvider 地形
    const promise = Cesium.CesiumTerrainProvider.fromIonAssetId(3956, {
      requestVertexNormals: true,
    });

    // const promise = Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(
    //   "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    // );
    promise.then((terrainProvider) => {
      viewer.terrainProvider = terrainProvider;
    });
  }

  viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
  viewer.scene.globe.depthTestAgainstTerrain = true;

  // 是否支持坐标拾取：
  if (options.isPositionPick) {
    positionPick(viewer);
  }

  return viewer;
}

function positionPick(viewer) {
  // 鼠标事件
  const eventHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  eventHandler.setInputAction(function (e) {
    // console.log(e);
    // const { x, y } = e.position;
    // const cartesian3 = viewer.scene.pickPosition(
    //   new Cesium.Cartesian2(x, y)
    // );
    // console.log(cartesian3);
    // const coordinate = Cesium.Cartographic.fromCartesian(cartesian3);
    // console.log(coordinate);
    // // 弧度转度
    // coordinate.latitude = (coordinate.latitude * 180) / Math.PI;
    // coordinate.longitude = (coordinate.longitude * 180) / Math.PI;
    // console.log(coordinate);

    var ray = viewer.camera.getPickRay(e.position); // 创建一条光线，起点为相机位置，穿过给定坐标（e.position）的像素
    var cartesian = viewer.scene.globe.pick(ray, viewer.scene); // 获取光线与椭球体表面的交点，交点的坐标为笛卡尔坐标（Cartesian3）。
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian); // 笛卡尔坐标转经纬度坐标（单位为弧度）
    var lng = Cesium.Math.toDegrees(cartographic.longitude); //经度值
    var lat = Cesium.Math.toDegrees(cartographic.latitude); //纬度值
    let height = cartographic.height; // 高程
    // let height=viewer.scene.globe.getHeight(cartographic); // 高程
    var mapPosition = { lng: lng, lat: lat, z: height };
    console.log({
      position: mapPosition,
      positionArr: [lng, lat],
      positionArr1: [lng, lat, height],
    });
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

export default createViewer;
