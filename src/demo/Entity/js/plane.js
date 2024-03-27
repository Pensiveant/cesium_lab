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

const centerPoint = [104.06335998805471, 30.659858531850176, 500]; // 中心点的经度、纬度、高程
const point = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint[0],
    centerPoint[1],
    centerPoint[2]
  ),
  point: {
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  },
});
viewer.entities.add(point);

const plane = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint[0],
    centerPoint[1],
    centerPoint[2]
  ), // 定义本地坐标系原点
  plane: {
    plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, -50), // 垂直于Z轴，距离原点为-50
    dimensions: new Cesium.Cartesian2(100, 50),
    material: Cesium.Color.RED,
  },
});
viewer.entities.add(plane);

const centerPoint1 = [104.06624013406136, 30.660572590247572, 500]; // 
const point1 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint1[0],
    centerPoint1[1],
    centerPoint1[2]
  ),
  point: {
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  },
});
viewer.entities.add(point1);
const plane1 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint1[0],
    centerPoint1[1],
    centerPoint1[2]
  ), // 本地坐标系原点
  plane: {
    plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_X, 50), // 垂直于X轴，距离为50
    dimensions: new Cesium.Cartesian2(100, 50),
    material: Cesium.Color.YELLOW,
  },
});
viewer.entities.add(plane1);

viewer.flyTo(viewer.entities);
