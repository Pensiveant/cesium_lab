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
let material = Cesium.createElevationBandMaterial({
  scene: viewer.scene,
  layers: [
    {
      entries: [
        {
          height: 1000.0,
          color: new Cesium.Color(0.0, 0.0, 0.0, 1.0),
        },
        {
          height: 3000.0,
          color: new Cesium.Color(1.0, 1.0, 1.0, 1.0),
        },
      ],
      extendDownwards: true,
      extendUpwards: true,
    },
    {
      entries: [
        {
          height: 3000.0,
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
        },
        {
          height: 4000.0,
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
        },
      ],
    },
    {
      entries: [
        {
          height: 4000.0,
          color: new Cesium.Color(0.0, 1.0, 0.0, 0.5),
        },
        {
          height: 5500.0,
          color: new Cesium.Color(0.0, 1.0, 0.0, 0.5),
        },
      ],
    },
    {
      entries: [
        {
          height: 5500.0,
          color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
        },
        {
          height: 7000.0,
          color: new Cesium.Color(0.0, 0.0, 1.0, 0.5),
        },
      ],
    },
  ],
});

// let material = new Cesium.Material.fromType("ElevationBand", {
//   heights: "./img/snow.webp",
//   colors:"./img/wood.jpg",
// });
globe.material = material;
