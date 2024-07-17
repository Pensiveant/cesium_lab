// const Cesium = require("cesium"); // 智能提示使用
import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain:false,
});


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

const ellipse = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint[0],
    centerPoint[1],
    centerPoint[2]
  ), // 定义本地坐标系原点
  ellipse: {
    semiMajorAxis: 80,
    semiMinorAxis: 40,
    material: Cesium.Color.RED,
    // height: 100,
    // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  },
});
viewer.entities.add(ellipse);

const centerPoint1 = [104.06624013406136, 30.660572590247572, 500]; //
const point1 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint1[0],
    centerPoint1[1],
    centerPoint1[2]
  ),
  point: {
    pixelSize: 5,
    color: Cesium.Color.RED,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 2,
  },
});
viewer.entities.add(point1);
const ellipse1 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    centerPoint1[0],
    centerPoint1[1],
    centerPoint1[2]
  ), // 本地坐标系原点
  ellipse: {
    semiMajorAxis: 80,
    semiMinorAxis: 40,
    material: Cesium.Color.BLUE.withAlpha(0.5),
    height: 50,
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    rotation: Cesium.Math.toRadians(90), // 圆形，绕北逆时针旋转90度
    outline: true,
    outlineColor: Cesium.Color.YELLOW,
    outlineWidth: 1,
  },
});
viewer.entities.add(ellipse1);

const ellipse2 = new Cesium.Entity({
  position: Cesium.Cartesian3.fromDegrees(
    104.06206037235002,
    30.65901615923885,
    458.80041016490196
  ), // 本地坐标系原点
  ellipse: {
    semiMajorAxis: 80,
    semiMinorAxis: 40,
    material: Cesium.Color.BLUE.withAlpha(0.5),
    height: 50,
    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
    extrudedHeight: 100,
    numberOfVerticalLines: 10,
    outline: true,
    outlineColor: Cesium.Color.YELLOW,
    outlineWidth: 1,
  },
});
viewer.entities.add(ellipse2);

viewer.flyTo(viewer.entities);
