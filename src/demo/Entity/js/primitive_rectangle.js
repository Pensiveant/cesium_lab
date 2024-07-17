 // const Cesium = require("cesium"); // 智能提示使用
 import createViewer from "../../js/initViewer.js";
 const viewer = createViewer({
   showTerrain: false
 });
 


// 加载矩形
const rectanglePrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(
        104.06659151481527,
        30.648006045014633,
        104.06912063115297,
        30.648898281515343
      ),
      height: 500,    // 高度
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
    }),
  }),
  appearance: new Cesium.EllipsoidSurfaceAppearance({
    material: new Cesium.Material.fromType("Color", {
      color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
    }),
  }),
});
viewer.scene.primitives.add(rectanglePrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06659151481527,
    30.648006045014633,
    1500
  ),
});
