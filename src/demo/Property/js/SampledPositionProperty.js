// const Cesium = require("cesium"); // 智能提示使用

import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  animation: true,
  timeline: true,
  showTerrain: false
});

const centerPoint = [104.06335998805471, 30.659858531850176, 0]; // 中心点的经度、纬度、高程
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
const positions = [
  [104.06167203482484, 30.660752720207025, 0],
  [104.06498793544395, 30.660802697522946, 0],
  [104.06492603695042, 30.65891575595152, 0],
  [104.06180683364038, 30.658935162378565, 0],
];

let startTime = Cesium.JulianDate.now();
let positionProperty = new Cesium.SampledPositionProperty();
positionProperty.addSample(
  startTime,
  Cesium.Cartesian3.fromDegrees(
    positions[0][0],
    positions[0][1],
    positions[0][2]
  )
);

let nexTime = Cesium.JulianDate.addSeconds(
  startTime,
  10,
  new Cesium.JulianDate()
); // 10秒后
let nextPosition = Cesium.Cartesian3.fromDegrees(
  positions[1][0],
  positions[1][1],
  positions[1][2]
);
positionProperty.addSample(nexTime, nextPosition);

let stopTime = Cesium.JulianDate.addSeconds(
  nexTime,
  10,
  new Cesium.JulianDate()
); // 10秒后
let stopPosition = Cesium.Cartesian3.fromDegrees(
  positions[2][0],
  positions[2][1],
  positions[2][2]
);
positionProperty.addSample(stopTime, stopPosition);

let modeEntity = new Cesium.Entity({
  name: "su7",
  position: positionProperty, // 初始位置
  model: {
    uri: "../../data/models/su7/SU7.glb",
  },
});
// 创建一个实体并将节点变换属性应用到它
var entity = viewer.entities.add(modeEntity);


viewer.clock.startTime = startTime.clone();
viewer.clock.stopTime = stopTime.clone();
viewer.clock.currentTime = startTime.clone();
viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
viewer.clock.multiplier = 1;
viewer.timeline.zoomTo(startTime, stopTime);

viewer.flyTo(entity);
