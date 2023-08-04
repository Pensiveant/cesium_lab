const Cesium = require('cesium');

// 构造函数 

const mat=new Cesium.Matrix4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
console.log(mat.toString()); // '(1, 2, 3, 4)/n(5, 6, 7, 8)/n(9, 10, 11, 12)/n(13, 14, 15, 16)'

// 按列转为数组（pack）
const matPack=new Cesium.Matrix4(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16);
const pack=new Cesium.Matrix4.pack(matPack,new Array());
console.log(pack); // [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]

// 
const packArray=new Cesium.Matrix4.packArray([mat,matPack],new Array());
console.log(packArray); // [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16]

// 加法
const addLeftArr=new Array(16).fill(1,0);
const addLeft=new Cesium.Matrix4.fromArray(addLeftArr);
const addRightArr=new Array(16).fill(2,0);
const addRight=new Cesium.Matrix4.fromArray(addRightArr);
let add=Cesium.Matrix4.add(addLeft,addRight,new Cesium.Matrix4());
console.log(add);

// 减法
let subtract=Cesium.Matrix4.subtract(addLeft,addRight,new Cesium.Matrix4());
console.log(subtract);

// 取反
const mat1=new Cesium.Matrix4(1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4);
let negate=Cesium.Matrix4.negate(mat1,new Cesium.Matrix4());
console.log(negate);

// 转置


// 获取索引
let index=Cesium.Matrix4.getElementIndex(1,0);
console.log(index);

// 获取仿射变换矩阵的平移部分
const translationMat=new Cesium.Matrix4(1,0,0,4,0,1,0,8,0,0,1,12,1,0,0,1);
let translation=Cesium.Matrix4.getTranslation(translationMat,new Cesium.Cartesian3()); 
console.log(translation); // {x: 4, y: 8, z: 12}