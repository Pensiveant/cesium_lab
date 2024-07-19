// const Cesium = require("cesium"); // 智能提示使用
import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain: false,
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
      height: 100, // 高度
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

// 加载拉伸矩形
const rectanglePrimitive1 = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(
        104.07101276545674,
        30.64756116020442,
        104.07282424610788,
        30.648629111428246
      ),
      height: 0, // 高度
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
      extrudedHeight: 100,
    }),
  }),
  appearance: new Cesium.EllipsoidSurfaceAppearance({
    material: new Cesium.Material.fromType("Color", {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
    }),
  }),
});
viewer.scene.primitives.add(rectanglePrimitive1);

const rectangleoutlinePrimitive = new Cesium.Primitive({
  geometryInstances: new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleOutlineGeometry({
      rectangle: Cesium.Rectangle.fromDegrees(
        104.07101276545674,
        30.64756116020442,
        104.07282424610788,
        30.648629111428246
      ),
      height: 0, // 高度
      vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
      extrudedHeight: 100,
    }),
  }),
  appearance: new Cesium.EllipsoidSurfaceAppearance({
    material: new Cesium.Material.fromType("Color", {
      color: new Cesium.Color(0.0, 1.0, 1.0, 1.0),
    }),
  }),
});
viewer.scene.primitives.add(rectangleoutlinePrimitive);

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06659151481527,
    30.648006045014633,
    1500
  ),
});
