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

let positions = Cesium.Cartesian3.fromDegreesArrayHeights([
  104.06204432699153, 30.660726592602778, 458.0359123306434, 104.06491131775273,
  30.660792356429575, 457.5663362739622, 104.06488421424214, 30.65902970314711,
  462.1401663208093, 104.06206037235002, 30.65901615923885, 458.80041016490196,
]);
let polygonGeometry = new Cesium.PolygonGeometry({
  polygonHierarchy: new Cesium.PolygonHierarchy(positions),
  perPositionHeight: true,
});

let polygonPrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: polygonGeometry,
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
