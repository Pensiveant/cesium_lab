// const Cesium = require("cesium"); // 智能提示使用

import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain:false,
});

// 线
let positions = Cesium.Cartesian3.fromDegreesArray([
  104.06204432699153, 30.660726592602778, 104.06491131775273,
  30.660792356429575, 104.06488421424214, 30.65902970314711, 104.06206037235002,
  30.65901615923885,
]);
let polylineGeometry = new Cesium.PolylineGeometry({
  positions,
  width: 10.0,
  vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
});

let polylinePrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: polylineGeometry,
  }),
  appearance: new Cesium.PolylineMaterialAppearance({
    material: new Cesium.Material.fromType("PolylineDash", {
      color: Cesium.Color.RED,
      gapColor: Cesium.Color.TRANSPARENT,
      dashLength: 120.0,
      dashPattern: 255.0,
    }),
  }),
});
viewer.scene.primitives.add(polylinePrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06204432699153,
    30.660726592602778,
    1500
  ),
});
