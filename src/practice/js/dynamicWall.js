// const Cesium = require("cesium"); // 智能提示使用
import {modifyMap} from "./tools.js";

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
// let baseMap = Cesium.ImageryLayer.fromProviderAsync(
//   Cesium.ArcGisMapServerImageryProvider.fromUrl(
//     "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
//   )
// );
// viewer.imageryLayers.add(baseMap);

var options = {
  style: 'elec', // style: img、elec、cva
  crs: 'WGS84' // 使用84坐标系，默认为：GCJ02
}
viewer.imageryLayers.add(new Cesium.ImageryLayer( new AmapImageryProvider(options)))
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
window.viewer = viewer;
modifyMap(viewer, {
  //反色?
  invertColor: true,
  //滤镜值
  filterRGB: [60, 145, 172]
});
loadWall(viewer);

async function loadWall(viewer) {
  try {
    let res = await Cesium.Resource.fetchJson({
      url: "./data/金堂县.json",
      queryParameters: {
        outputFormat: "application/json",
      },
    });

    // 加载Geojson: 面
    Cesium.GeoJsonDataSource.load(res, {
      stroke: Cesium.Color.RED,
      strokeWidth: 5,
      fill: Cesium.Color.RED.withAlpha(0),
    }).then((polygonGeojson) => {
      viewer.dataSources.add(polygonGeojson);
      viewer.flyTo(polygonGeojson); // 定位
    });

    const { coordinates } = res.features[0].geometry;
    const points = coordinates[0][0];
    const positions = [];
    for (let i = 1; i < points.length; i++) {
      const item = points[i];
      positions.push(item[0]);
      positions.push(item[1]);
    }
    drawWall(viewer, positions);
  } catch (error) {
    throw new Error("加载json失败");
  }
}

function drawWall(viewer, positions) {
  // 绘制墙体
  viewer.entities.add({
    name: "立体墙效果",
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArray(positions),
      // 设置高度
      maximumHeights: new Array(positions.length).fill(1900),
      minimumHeights: new Array(positions.length).fill(0),
      material: new Cesium.DynamicWallMaterialProperty({
        color: Cesium.Color.fromBytes(55, 96, 56).withAlpha(0.7),
        duration: 3000,
      }),
    },
  });
}

window.drawWall = drawWall;

//动态墙材质
function DynamicWallMaterialProperty(options) {
  // 默认参数设置
  this._definitionChanged = new Cesium.Event();
  this._color = undefined;
  this._colorSubscription = undefined;
  this.color = options.color;
  this.duration = options.duration;
  this.trailImage = options.trailImage;
  this._time = new Date().getTime();
}
Object.defineProperties(DynamicWallMaterialProperty.prototype, {
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
});
DynamicWallMaterialProperty.prototype.getType = function (time) {
  return "DynamicWall";
};
DynamicWallMaterialProperty.prototype.getValue = function (time, result) {
  if (!Cesium.defined(result)) {
    result = {};
  }
  result.color = Cesium.Property.getValueOrClonedDefault(
    this._color,
    time,
    Cesium.Color.WHITE,
    result.color
  );
  if (this.trailImage) {
    result.image = this.trailImage;
  } else {
    result.image = Cesium.Material.DynamicWallImage;
  }

  if (this.duration) {
    result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration;
  }
  viewer.scene.requestRender();
  return result;
};
DynamicWallMaterialProperty.prototype.equals = function (other) {
  return (
    this === other ||
    (other instanceof DynamicWallMaterialProperty &&
      Cesium.Property.equals(this._color, other._color))
  );
};
Cesium.DynamicWallMaterialProperty = DynamicWallMaterialProperty;
Cesium.Material.DynamicWallType = "DynamicWall";
Cesium.Material.DynamicWallImage = "./img/colors.png";
Cesium.Material.DynamicWallSource = `czm_material czm_getMaterial(czm_materialInput materialInput){
                                          czm_material material = czm_getDefaultMaterial(materialInput);
                                          vec2 st = materialInput.st;
                                          vec4 colorImage = texture(image, vec2(fract(st.t - time), st.t));
                                          vec4 fragColor;
                                          fragColor.rgb = color.rgb / 1.0;
                                          fragColor = czm_gammaCorrect(fragColor);
                                          material.alpha = colorImage.a * color.a;
                                          material.diffuse = color.rgb;
                                          material.emission = fragColor.rgb;
                                          return material;
                                          }`;
Cesium.Material._materialCache.addMaterial(Cesium.Material.DynamicWallType, {
  fabric: {
    type: Cesium.Material.DynamicWallType,
    uniforms: {
      color: new Cesium.Color(1.0, 1.0, 1.0, 1),
      image: Cesium.Material.DynamicWallImage,
      time: 0,
    },
    source: Cesium.Material.DynamicWallSource,
  },
  translucent: function (material) {
    return true;
  },
});
window.DynamicWallMaterialProperty = DynamicWallMaterialProperty;
