// const Cesium = require("cesium");

// 初始化view
import createViewer from "../../js/initViewer.js";
const viewer = createViewer({
  showTerrain:false,
});

// 颜色材质
let colorEntity = new Cesium.Entity({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      104.06514664188914, 30.661695584721492, 104.06636547793352,
      30.661748394687102, 104.06633417256506, 30.661034327461035,
      104.06524455003793, 30.66097251235851,
    ]),
    // 边界线
    material: new Cesium.ColorMaterialProperty(Cesium.Color.RED),
  },
});
viewer.entities.add(colorEntity);

// 贴图材质
let polygonEntity = new Cesium.Entity({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      104.06191132017372, 30.660578937208562, 104.0647899580722,
      30.66057893144176, 104.0648108078706, 30.658975472403927,
      104.06183042266197, 30.65906414823539,
    ]),
    // 边界线
    material: new Cesium.ImageMaterialProperty({
      image: "./img/wood.jpg",
      repeat: new Cesium.Cartesian2(2, 2),
      //   color: Cesium.Color.BLUE.withAlpha(0.3),
      //   transparent:true,
    }),
  },
});
const wyoming = viewer.entities.add(polygonEntity);
viewer.zoomTo(wyoming);

// 棋盘纹理
let triangleEntity = new Cesium.Entity({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      104.06323070997296, 30.664859231902437, 104.06447156563476,
      30.663102418517475, 104.06216672075426, 30.663083850974235,
    ]),
    material: new Cesium.CheckerboardMaterialProperty({
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: new Cesium.Cartesian2(6, 6),  // 6*6的棋盘
    }),
  },
});
viewer.entities.add(triangleEntity);

// 条纹纹理
let holeEntity = new Cesium.Entity({
  polygon: {
    hierarchy: {
      positions: Cesium.Cartesian3.fromDegreesArray([
        104.06520496581112, 30.660551607385386, 104.06624013406136,
        30.660572590247572, 104.0662198895377, 30.65965616350186,
        104.06522032461255, 30.659597547644264,
      ]),
      holes: [
        new Cesium.PolygonHierarchy(
          Cesium.Cartesian3.fromDegreesArray([
            104.06576266477147, 30.660233507702728, 104.06597736705955,
            30.659875123894466, 104.06551790399301, 30.659882881849438,
          ])
        ),
      ],
    },
    material: new Cesium.StripeMaterialProperty({
      orientation: Cesium.StripeOrientation.VERTICAL,
      evenColor: Cesium.Color.WHITE,
      oddColor: Cesium.Color.BLACK,
      repeat: 16,
    }),
  },
});
viewer.entities.add(holeEntity);

// 网格纹理
let gridEntity = new Cesium.Entity({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      104.06155709475718, 30.66089837888473, 104.0618184704967,
      30.66089409316356, 104.06182197587567, 30.660548100761314,
      104.0615687626376, 30.660559136739582,
    ]),
    material: Cesium.Color.RED.withAlpha(0.5),
    perPositionHeight: true,
    outline: true,
    outlineWidth: 2,
    outlineColor: Cesium.Color.BLUE,
  },
});
viewer.entities.add(gridEntity);

let polygonEntity2 = new Cesium.Entity({
  polygon: {
    hierarchy: Cesium.Cartesian3.fromDegreesArray([
      104.06155709475718, 30.66089837888473, 104.0618184704967,
      30.66089409316356, 104.06182197587567, 30.660548100761314,
      104.0615687626376, 30.660559136739582,
    ]),
    material: new Cesium.GridMaterialProperty({
      color: Cesium.Color.YELLOW,
      cellAlpha: 0.5,
      lineCount: new Cesium.Cartesian2(8, 8),
      lineThickness: new Cesium.Cartesian2(2.0, 2.0),
      lineOffset: new Cesium.Cartesian2(10.0, 10.0), // ????
    }),
  },
});
viewer.entities.add(polygonEntity2);

// 发光材质
let lineEntity = new Cesium.Entity({
  name: "lineEntity",
  polyline: new Cesium.PolylineGraphics({
    positions: Cesium.Cartesian3.fromDegreesArray(
      [
        104.0629990542155, 30.66158983061622, 104.06362546304193,
        30.661600928417656,
      ],
      viewer.scene.globe.ellipsoid
    ),
    width: 5,
    material: new Cesium.PolylineGlowMaterialProperty({
      glowPower: 0.8,
      taperPower: 0.5,
      color: Cesium.Color.CORNFLOWERBLUE,
    }),
  }),
});
viewer.entities.add(lineEntity);

// 外轮廓材质
let lineEntity1 = new Cesium.Entity({
  name: "lineEntity",
  polyline: new Cesium.PolylineGraphics({
    positions: Cesium.Cartesian3.fromDegreesArray(
      [
        104.06299950977659, 30.66186160246042, 104.06362806286003,
        30.661879187141853,
      ],
      viewer.scene.globe.ellipsoid
    ),
    width: 5,
    material: new Cesium.PolylineOutlineMaterialProperty({
      color: Cesium.Color.ORANGE,
      outlineWidth: 5,
      outlineColor: Cesium.Color.BLACK,
    }),
  }),
});
viewer.entities.add(lineEntity1);

// 带有箭头的线
let lineEntity2 = new Cesium.Entity({
  name: "lineEntity",
  polyline: new Cesium.PolylineGraphics({
    positions: Cesium.Cartesian3.fromDegreesArray(
      [
        104.06300386722306, 30.66176933486534, 104.0636219934538,
        30.661788192219802,
      ],
      viewer.scene.globe.ellipsoid
    ),
    width: 5,
    material: new Cesium.PolylineArrowMaterialProperty(Cesium.Color.PURPLE),
  }),
});
viewer.entities.add(lineEntity2);

// 虚线
let lineEntity3 = new Cesium.Entity({
  name: "lineEntity",
  polyline: new Cesium.PolylineGraphics({
    positions: Cesium.Cartesian3.fromDegreesArray(
      [
        104.06301105022625, 30.66167753947682, 104.06361928944003,
        30.66169440569928,
      ],
      viewer.scene.globe.ellipsoid
    ),
    width: 5,
    material: new Cesium.PolylineDashMaterialProperty({
      color: Cesium.Color.CYAN,
    }),
  }),
});
viewer.entities.add(lineEntity3);
