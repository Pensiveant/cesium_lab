// const Cesium = require("cesium"); // 智能提示使用
import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain: false
});

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

let circleGeometry = new Cesium.CircleGeometry({
  center: Cesium.Cartesian3.fromDegrees(104.06335998805471, 30.659858531850176),
  radius: 100.0,
  height: 0,
  // granularity: Cesium.Math.toRadians(10),
  // extrudedHeight: 100, // 拉伸高度
});

let polygonPrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: circleGeometry,
  }),
  appearance: new Cesium.EllipsoidSurfaceAppearance({
    material: new Cesium.Material.fromType("Color", {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.3),
    }),
  }),
});
viewer.scene.primitives.add(polygonPrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06204432699153,
    30.660726592602778,
    1500
  ),
});
