//const Cesium = require("cesium"); // 智能提示使用

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

// 圆柱体
const cylinder = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint[0],
    centerPoint[1],
    centerPoint[2]
  ),
  cylinder: {
    length: 20,
    topRadius: 10,
    bottomRadius: 10,
    material: Cesium.Color.GREEN.withAlpha(0.5),
  },
});
viewer.entities.add(cylinder);

// 圆锥体
const cylinder1 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    104.06520496581112,
    30.660551607385386,
    500
  ),
  cylinder: {
    length: 20,
    topRadius: 0,
    bottomRadius: 5,
    material: Cesium.Color.GREEN.withAlpha(0.5),
  },
});
viewer.entities.add(cylinder1);

// 圆锥体
const cylinder2 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    104.06624013406136,
    30.660572590247572,
    500
  ),
  cylinder: {
    length: 20,
    topRadius: 0,
    bottomRadius: 5,
    material: Cesium.Color.GREEN.withAlpha(0.5),
    slices: 5,
    outline: true,
    outlineWidth: 1,
    outlineColor: Cesium.Color.YELLOW,
  },
});
viewer.entities.add(cylinder2);

const cylinder3 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    104.0662198895377,
    30.65965616350186,
    500
  ),  
  cylinder: {
    length: 20,
    topRadius: 10,
    bottomRadius: 10,
    material: Cesium.Color.GREEN.withAlpha(0.5),
    numberOfVerticalLines:1,
    slices: 5,
    outline: true,
    outlineWidth: 1,
    outlineColor: Cesium.Color.YELLOW,
  },
});
viewer.entities.add(cylinder3);

viewer.flyTo(viewer.entities);
