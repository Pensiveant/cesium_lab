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
let material = new Cesium.Material.fromType("ElevationContour", {
  color: Cesium.Color.RED,
  spacing: 100, // 等高线间距（米）
  width: 3,  // 等高线宽度
});
globe.material = material;
