// const Cesium = require("cesium");

// 初始化view
const viewer = new Cesium.Viewer("cesiumContainer", {
  geocoder: false, // 搜索功能
  homeButton: false, // home
  sceneModePicker: false, // 隐藏二三维切换
  baseLayerPicker: false, //隐藏默认底图选择控件
  navigationHelpButton: false, // 帮助？saa号
  animation: false,
  infoBox: false,
  timeline: false,
  fullscreenButton: false,
  // 使用ArcGIS 底图
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  }),
});
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo

// 定位到成都
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06852500142547,
    30.643980339058135,
    400
  ),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-45.0),
  },
});

// 自定义颜色材质
viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(
          104.06659151481527,
          30.648006045014633,
          104.06912063115297,
          30.648898281515343
        ),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
      }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material.fromType("DiffuseMap", {
        image: "./img/wood.jpg",
        channels:"rgb",  // 
        repeat: new Cesium.Cartesian2(2, 2),
      }),
    }),
  })
);