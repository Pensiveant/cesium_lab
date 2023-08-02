const Cesium = require("cesium");

// fromRotationMatrix

// fromHeadingPitchRoll

// pack(value, array, startingIndex) → Array.<number>
// 将四元素转换为数组
const quaternion = new Cesium.Quaternion(1, 1, 1, 1);
const pack = Cesium.Quaternion.pack(quaternion, new Array());
console.log(pack); // [1, 1, 1, 1]

// unpack(array, startingIndex, result) → Quaternion
// 数组-> Quaternion
const unpack = Cesium.Quaternion.unpack([1, 2, 3, 4]);
console.log(unpack); // Quaternion {x: 1, y: 2, z: 3, w: 4}

// Quaternion.fromAxisAngle(axis, angle, result) → Quaternion
const angle = Cesium.Quaternion.fromAxisAngle(
  new Cesium.Cartesian3(1, 0, 0),
  Cesium.Math.toRadians(60)
);
console.log(angle); // Quaternion {x: 0.49999999999999994, y: 0, z: 0, w: 0.8660254037844387}
