// const Cesium = require("cesium"); // 智能提示使用

Cesium.Ion.defaultAccessToken = defaultAccessToken;
// 初始化view
const viewer = new Cesium.Viewer("cesiumContainer", {
  geocoder: false, // 搜索功能
  homeButton: false, // home
  sceneModePicker: false, // 隐藏二三维切换
  baseLayerPicker: false, //隐藏默认底图选择控件
  navigationHelpButton: false, // 帮助？号
  animation: true,
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

const centerPoint = [104.06335998805471, 30.659858531850176, 0]; // 中心点的经度、纬度、高程
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
// 创建一个节点变换属性对象

let translation = new Cesium.Cartesian3(0, 0, 0);
var rotation = Cesium.Quaternion.IDENTITY; // 单位四元数表示无旋转
var scale = new Cesium.Cartesian3(0.1, 0.1, 0.1);
var nodeTransformation = new Cesium.NodeTransformationProperty({
  translation,
  rotation,
  scale,
});

let modeEntity = new Cesium.Entity({
  name: "Moving Entity",
  position: Cesium.Cartesian3.fromDegrees(
    104.06335998805471,
    30.659858531850176,
    0
  ), // 初始位置
  model: {
    uri: "../../data/models/gltf/Wheel.glb",
    // 将节点变换属性应用到模型
    nodeTransformations: {
      "Plane.001": nodeTransformation, // 'Plane.001'为gltf模型，节点名称
    },
    // nodeTransformations: new Cesium.PropertyBag(
    //   {
    //     "Plane.001": nodeTransformation,
    //   },
    //   (key, value) => {
    //     console.log(key);
    //     console.log(value);
    //   }
    // ),
  },
});
// 创建一个实体并将节点变换属性应用到它
var entity = viewer.entities.add(modeEntity);

viewer.flyTo(entity);
