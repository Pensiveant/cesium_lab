// const Cesium = require("cesium"); // 智能提示使用

// 初始化view
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhYzVkMTc1ZS00NTRhLTRjY2QtYTQwZS01YmU2Mjg1ODAwN2YiLCJpZCI6MjU5LCJpYXQiOjE2ODgzOTgwMjl9.MZC_HUBRd0y5HJeB-F5QSpT-fEgTM6mI5gMaSND9FHc";
const viewer = new Cesium.Viewer("cesiumContainer", {
  geocoder: false, // 搜索功能
  homeButton: false, // home
  sceneModePicker: false, // 隐藏二三维切换
  baseLayerPicker: false, //隐藏默认底图选择控件
  navigationHelpButton: false, // 帮助？号
  animation: false,
  infoBox: false,
  timeline: false,
  fullscreenButton: false,
  // terrain: Cesium.Terrain.fromWorldTerrain(),
});
let atLayer = new Cesium.UrlTemplateImageryProvider({
  url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
  minimumLevel: 3,
  maximumLevel: 18
})
viewer.imageryLayers.addImageryProvider(atLayer);

// var options = {
//   style: 'elec', // style: img、elec、cva
//   crs: 'WGS84' // 使用84坐标系，默认为：GCJ02
// }
// viewer.imageryLayers.add(new Cesium.ImageryLayer( new AmapImageryProvider(options)))
modifyMap(viewer, {
    //反色?
    invertColor: true,
    //滤镜值
    filterRGB: [60, 145, 172]
});

viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
window.viewer = viewer;

loadRoad(viewer);


// https://github.com/ren5927/CesiumDarkMap
function modifyMap(viewer, options) {
  const baseLayer = viewer.imageryLayers.get(1)
  //以下几个参数根据实际情况修改,目前我是参照火星科技的参数,个人感觉效果还不错
  baseLayer.brightness = options.brightness || 0.6
  baseLayer.contrast = options.contrast || 1.8
  baseLayer.gamma = options.gamma || 0.3
  baseLayer.hue = options.hue || 1
  baseLayer.saturation = options.saturation || 0
  const baseFragShader = (viewer.scene.globe)._surfaceShaderSet
      .baseFragmentShaderSource.sources
  for (let i = 0; i < baseFragShader.length; i++) {
      const strS = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
      let strT = 'color = czm_saturation(color, textureSaturation);\n#endif\n'
      if (options.invertColor) {
          strT += `
                  color.r = 1.0 - color.r;
                  color.g = 1.0 - color.g;
                  color.b = 1.0 - color.b;
                  `
      }
      if (options.filterRGB.length > 0) {
          strT += `
                  color.r = color.r * ${options.filterRGB[0]}.0/255.0;
                  color.g = color.g * ${options.filterRGB[1]}.0/255.0;
                  color.b = color.b * ${options.filterRGB[2]}.0/255.0;
                  `
      }
      baseFragShader[i] = baseFragShader[i].replace(strS, strT)
  }
}



function loadRoad(viewer) {
  Cesium.GeoJsonDataSource.load("./data/nanshan-road1.geojson").then(function (
    dataSource
  ) {
    viewer.dataSources.add(dataSource);
    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity.polyline.width = 1.7;
      entity.polyline.material = new Cesium.Spriteline1MaterialProperty(
        4000,
        "./img/spriteline1.png"
      );
    }
    viewer.flyTo(dataSource.entities);
  });

  Cesium.GeoJsonDataSource.load("./data/nanshan-road2.geojson").then(function (
    dataSource
  ) {
    viewer.dataSources.add(dataSource);
    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity.polyline.width = 1.7;
      entity.polyline.material = new Cesium.Spriteline1MaterialProperty(
        1000,
        "./img/spriteline2.png"
      );
    }
  });

  Cesium.GeoJsonDataSource.load("./data/nanshan-road3.geojson").then(function (
    dataSource
  ) {
    viewer.dataSources.add(dataSource);
    const entities = dataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];
      entity.polyline.width = 1.7;
      entity.polyline.material = new Cesium.Spriteline1MaterialProperty(
        1000,
        "./img/spriteline3.png"
      );
    }
  });
}

//#region
/**
 *  精灵穿梭路光效果，
 *  参考gitee开源
 *  entity的材质使用MaterialProperty,而primitive使用的是material。
 *  @Data：2022-01-11
 */

function Spriteline1MaterialProperty(duration, image) {
  this._definitionChanged = new Cesium.Event();
  this.duration = duration;
  this.image = image;
  this._time = performance.now();
}
Object.defineProperties(Spriteline1MaterialProperty.prototype, {
  isConstant: {
    get: function () {
      return false;
    },
  },
  definitionChanged: {
    get: function () {
      return this._definitionChanged;
    },
  },
  color: Cesium.createPropertyDescriptor("color"),
  duration: Cesium.createPropertyDescriptor("duration"),
});
Spriteline1MaterialProperty.prototype.getType = function (time) {
  return "Spriteline1";
};
Spriteline1MaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.image = this.image;
  result.time =
    ((performance.now() - this._time) % this.duration) / this.duration;
  return result;
};
Spriteline1MaterialProperty.prototype.equals = function (e) {
  return (
    this === e ||
    (e instanceof Spriteline1MaterialProperty && this.duration === e.duration)
  );
};
Cesium.Spriteline1MaterialProperty = Spriteline1MaterialProperty;
Cesium.Material.Spriteline1Type = "Spriteline1";
Cesium.Material.Spriteline1Source = `
czm_material czm_getMaterial(czm_materialInput materialInput)
{
czm_material material = czm_getDefaultMaterial(materialInput);
vec2 st = materialInput.st;
vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
material.alpha = colorImage.a;
material.diffuse = colorImage.rgb * 1.5 ;
return material;
}
`;
// st :二维纹理坐标
// czm_material：保存可用于照明的材质信息
Cesium.Material._materialCache.addMaterial(Cesium.Material.Spriteline1Type, {
  fabric: {
    type: Cesium.Material.Spriteline1Type,
    uniforms: {
      color: new Cesium.Color(1, 0, 0, 0.5),
      image: "",
      transparent: true,
      time: 30,
    },
    source: Cesium.Material.Spriteline1Source,
  },
  translucent: function (material) {
    return true;
  },
});
//#endregion
