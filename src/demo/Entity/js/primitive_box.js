// const Cesium = require("cesium"); // 智能提示使用
import createViewer from "../../js/initViewer.js";
const viewer = createViewer();

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

let box = new Cesium.BoxGeometry({
  vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
  // 等价于使用六个平面，截取出长方体
  maximum: new Cesium.Cartesian3(20.0, 40.0, 60.0),     // x,y,z坐标的最大值
  minimum: new Cesium.Cartesian3(-20.0, -40.0, -60.0),  // x,y,z坐标的最小值
});
let boxGeometry = Cesium.BoxGeometry.createGeometry(box);

const center = Cesium.Cartesian3.fromDegrees(
  104.06335998805471,
  30.659858531850176,
  500
);
const transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);
let boxPrimitive = new Cesium.Primitive({
  // modelMatrix: transform,   // 整体定义：模型变换矩阵，将长方体，变换到世界坐标中
  geometryInstances: new Cesium.GeometryInstance({
    geometry: box,
    modelMatrix: transform, // 单独定义：模型变换矩阵，将长方体，变换到世界坐标中
  }),
  appearance: new Cesium.EllipsoidSurfaceAppearance({
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
