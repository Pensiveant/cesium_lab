import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  isPositionPick: true,
});

//
let material = new Cesium.ImageMaterialProperty({
  image: "./img/wood.jpg",
  transparent: true,
  //   color: Cesium.Color.RED.withAlpha(0.3),
});

let polygonEntity = new Cesium.Entity({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
      104.06204432699153, 30.660726592602778, 458.0359123306434,
      104.06491131775273, 30.660792356429575, 457.5663362739622,
      104.06488421424214, 30.65902970314711, 462.1401663208093,
      104.06206037235002, 30.65901615923885, 458.80041016490196,
    ]),

    material: material,
  },
});
const wyoming = viewer.entities.add(polygonEntity);

//
function getTextCanvas() {
  let text = "已批准";
  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#f00";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  const fontSize = 100;
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = "#f00";
  ctx.textBaseline = "middle";
  ctx.fillText(
    text,
    canvas.width / 2 - (fontSize * text.length) / 2,
    canvas.height / 2
  );
  return canvas;
}

let canvas = getTextCanvas();
let material1 = new Cesium.ImageMaterialProperty({
  image: canvas,
  //   repeat: new Cesium.Cartesian2(2.0, 2.0),
  //   transparent: true
});
let polygonEntity1 = new Cesium.Entity({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([
      104.06515168404, 30.660847565050325, 460.16688266683764,
      104.06640019084891, 30.660897006529854, 460.6073386817386,
      104.06630717387115, 30.65965116038826, 468.76663747393235,
      104.06520401693535, 30.65976441575587, 459.20366533252457,
    ]),
    material: material1,
  },
});
viewer.entities.add(polygonEntity1);

viewer.flyTo(viewer.entities);
