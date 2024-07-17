// const Cesium = require("cesium"); // 智能提示使用
import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain: false
});


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
let positions = Cesium.Cartesian3.fromDegreesArrayHeights([
  104.06204432699153, 30.660726592602778, 200, 
  104.06491131775273,30.660792356429575, 200, 
  104.06488421424214, 30.65902970314711,200, 
  104.06206037235002, 30.65901615923885, 200,
  104.06204432699153, 30.660726592602778, 200,
]);
let wallGeometry = new Cesium.WallGeometry({
  positions,
  minimumHeights:[100,100,100,100,100], // 墙的最低高度，未指定，则为0.0
  minimumHeights:[700,700,700,700,700], // 墙的最大高度，未指定，使用点的高度
});

let polygonPrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: wallGeometry,
  }),
  appearance : new Cesium.MaterialAppearance({
    material : Cesium.Material.fromType('Color'),
    faceForward : true
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
