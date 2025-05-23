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

// 线
let positions = Cesium.Cartesian3.fromDegreesArray([
  104.06204432699153, 30.660726592602778, 104.06491131775273,
  30.660792356429575, 104.06488421424214, 30.65902970314711, 104.06206037235002,
  30.65901615923885,
]);

let simplePolylineGeometry = new Cesium.SimplePolylineGeometry({
  positions,
  colorsPerVertex: true,
  colors: [
    new Cesium.Color(1.0, 0.0, 0.0, 0),
    new Cesium.Color(0.0, 1.0, 0.0, 0),
    new Cesium.Color(0.0, 0.0, 1.0, 0),
    new Cesium.Color(0.0, 1.0, 1.0, 0),
  ],
});
let polylineGeometry = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: simplePolylineGeometry,
  }),
  appearance: new Cesium.PolylineColorAppearance({
    translucent: false,
  }),
});
viewer.scene.primitives.add(polylineGeometry);

// // 
// let positions = Cesium.Cartesian3.fromDegreesArray([
//   104.06204432699153, 30.660726592602778, 104.06491131775273,
//   30.660792356429575, 104.06488421424214, 30.65902970314711, 104.06206037235002,
//   30.65901615923885,
// ]);
let polylineVolumeGeometry = new Cesium.PolylineVolumeGeometry({
  polylinePositions: positions,
  // shapePositions: computeCircle(20),
  shapePositions: [
    new Cesium.Cartesian2(-20, -20),
    new Cesium.Cartesian2(20, -20),
    new Cesium.Cartesian2(20, 20),
    new Cesium.Cartesian2(-20, 20),
  ]
});

let polylineVolumePrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: polylineVolumeGeometry,
  }),
  appearance: new Cesium.MaterialAppearance({
    material: new Cesium.Material.fromType("Color", {
      color: new Cesium.Color(1.0, 1.0, 1.0, 0.2),
    }),
  }),
});
viewer.scene.primitives.add(polylineVolumePrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06204432699153,
    30.660726592602778,
    1500
  ),
});

function computeCircle(radius) {
  const positions = [];
  for (let i = 0; i < 360; i++) {
    const radians = Cesium.Math.toRadians(i);
    positions.push(
      new Cesium.Cartesian2(
        radius * Math.cos(radians),
        radius * Math.sin(radians)
      )
    );
  }
  return positions;
}
