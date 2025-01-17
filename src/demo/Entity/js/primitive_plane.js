// const Cesium = require("cesium"); // 智能提示使用
import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain: false
});


const centerPoint = [104.06335998805471, 30.659858531850176, 300]; // 中心点的经度、纬度、高程
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

var dimensions = new Cesium.Cartesian3(100.0, 300.0);
var positionOnEllipsoid = Cesium.Cartesian3.fromDegrees(
  104.06335998805471,
  30.659858531850176,
  300
);
var translateMatrix =
  Cesium.Transforms.eastNorthUpToFixedFrame(positionOnEllipsoid);
var scaleMatrix = Cesium.Matrix4.fromScale(dimensions);

var planeModelMatrix = new Cesium.Matrix4();
Cesium.Matrix4.multiply(translateMatrix, scaleMatrix, planeModelMatrix);

let sphere = new Cesium.PlaneGeometry({
  vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
});
let boxPrimitive = new Cesium.Primitive({
  // modelMatrix: transform,   // 整体定义：模型变换矩阵，将长方体，变换到世界坐标中
  geometryInstances: new Cesium.GeometryInstance({
    geometry: sphere,
    modelMatrix: planeModelMatrix, // 单独定义：模型变换矩阵，将长方体，变换到世界坐标中
  }),
  appearance: new Cesium.MaterialAppearance({
    material: new Cesium.Material.fromType("Color", {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.3),
    }),
  }),
});
viewer.scene.primitives.add(boxPrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06335998805471,
    30.659858531850176,
    1500
  ),
});
