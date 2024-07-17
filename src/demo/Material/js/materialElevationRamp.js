// const Cesium = require("cesium"); // 智能提示使用
import createViewer from "../../js/initViewer.js";
const viewer = createViewer();

viewer.camera.flyTo({
  destination: Cesium.Cartesian3.fromDegrees(
    103.66553274314929,
    31.341147649314625,
    5000
  ),
});

// 设置等高线样式
let globe = viewer.scene.globe;
let material = new Cesium.Material.fromType("ElevationRamp", {
  image: "./img/snow.webp",
  minimumHeight: 1000,
  maximumHeight: 8000.0,
});
globe.material = material;
