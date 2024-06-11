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

const centerPoint = [104.06335998805471, 30.659858531850176, 100]; // 中心点的经度、纬度、高程
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

//
let cylinderGeometry = new Cesium.CylinderGeometry({
  length: 600,
  topRadius: 500,
  bottomRadius: 500,
  slices: 5, // 边的数量
});

// // 边框线柱体
// let cylinderOutlineGeometry = new Cesium.CylinderOutlineGeometry({
//   length: 600,
//   topRadius: 500,
//   bottomRadius: 500,
//   //slices: 5, // 边的数量
//   numberOfVerticalLines:150
// });


const center = Cesium.Cartesian3.fromDegrees(
  104.06335998805471,
  30.659858531850176,
  100
);
const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
let cylinderPrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: cylinderGeometry,
    modelMatrix: transform, // 定位
  }),
  appearance: new Cesium.MaterialAppearance({
    material: Cesium.Material.fromType("Color"),
    faceForward: true,
  }),
});
viewer.scene.primitives.add(cylinderPrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06204432699153,
    30.660726592602778,
    1500
  ),
});
