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

let ellipseGeometry = new Cesium.EllipseGeometry({
  center: Cesium.Cartesian3.fromDegrees(104.06335998805471, 30.659858531850176),
  semiMajorAxis: 100,
  semiMinorAxis: 50,
  rotation:Cesium.Math.toRadians(60.0)  // 逆时针旋转60°
});

let polygonPrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: ellipseGeometry,
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
