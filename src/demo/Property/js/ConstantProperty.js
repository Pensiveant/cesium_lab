// const Cesium = require("cesium"); // 智能提示使用

import createViewer from "../../js/initViewer.js"
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

// ConstantProperty
let dimensionsProperty = new Cesium.ConstantProperty(
  new Cesium.Cartesian3(100.0, 100.0, 50.0)
);
console.log(dimensionsProperty.valueOf()); //  new Cesium.Cartesian3(100.0, 100.0, 50.0)
console.log(dimensionsProperty.toString()); // '(100, 100, 50)'

// 长方体
const boxEntity = viewer.entities.add({
  name: "box",
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint[0],
    centerPoint[1],
    centerPoint[2]
  ),
  box: {
    dimensions: dimensionsProperty, // 长 、宽、高
    material: Cesium.Color.GREEN.withAlpha(0.5),
    outline: true,
    outlineColor: Cesium.Color.YELLOW,
  },
});

viewer.flyTo(boxEntity, {
  duration: 1, // 以秒为单位的飞行持续时间。
  offset: {
    heading: Cesium.Math.toRadians(0.0), // 以弧度为单位的航向角。
    pitch: -Math.PI / 2, // 以弧度为单位的俯仰角。
    range: 300, // 到中心的距离，以米为单位。
  },
});
