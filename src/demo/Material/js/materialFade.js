// const Cesium = require("cesium");

// 初始化view
import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain:false,
});

// 定位到成都
viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    104.06852500142547,
    30.643980339058135,
    400
  ),
  orientation: {
    heading: Cesium.Math.toRadians(0.0),
    pitch: Cesium.Math.toRadians(-45.0),
  },
});

// 自定义颜色材质
viewer.scene.primitives.add(
  new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
      geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(
          104.06659151481527,
          30.648006045014633,
          104.06912063115297,
          30.648898281515343
        ),
        vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
      }),
    }),
    appearance: new Cesium.MaterialAppearance({
      material: new Cesium.Material.fromType("Fade", {
        fadeInColor: Cesium.Color.WHITE,
        fadeOutColor: Cesium.Color.BLACK,
        maximumDistance: 0.7,
        repeat: false,
        fadeDirection: {
          x: true,
          y: false,
        },
        time: new Cesium.Cartesian2(1.0, 0.5),
      }),
    }),
  })
);
