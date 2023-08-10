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
  // 使用ArcGIS 底图
  imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
  }),
  terrain: Cesium.Terrain.fromWorldTerrain(),
});
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
window.viewer = viewer;

// 加载白模
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343);
window.tileset = tileset;
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);

function setCustomShader(type) {
  let customShader;
  if (type === "flow") {
    customShader = new FlowFloodLightShader();
  }
  tileset.customShader = customShader;
}

window.setCustomShader = setCustomShader;
viewer.postProcessStages.bloom.enabled=true,
//#region 泛光纹理
class FlowFloodLightShader {
  constructor(options) {
    this.diffuseColor = Cesium.Color.fromCssColorString("#1890ff"); // 漫反射颜色
    this.floodColor = Cesium.Color.fromCssColorString("yellow"); // 泛光颜色
    this.flowHeight = 200; // 泛光高度
    this.roughness = 1.0; // 粗糙程度
    this.occlusion = 1.0; // 环境遮蔽光程度
    this.speed = 7; // 速度
    this.bloom = {
      sigma: 2,
      brightness: 0.1,
      contrast: 128,
    }; // 泛光
    this.hierarchicalLineWidth = 0.4; //分层线宽，单位米
    this.dividerLevelHeight = 10; // 分层线间隔，单位米
    let customShade = this._init(this);
    return customShade;
  }

  _init(options) {
    let {
      diffuseColor,
      speed,
      floodColor,
      flowHeight,
      hierarchicalLineWidth,
      dividerLevelHeight,
      roughness,
      occlusion,
      bloom,
    } = options;

    let customShader = new Cesium.CustomShader({
      lightingModel: 1,
      translucencyMode: 0,
      uniforms: {
        u_speed: {
          type: Cesium.UniformType.FLOAT,
          value: speed,
        },
        //填充颜色
        u_diffuseColor: {
          type: Cesium.UniformType.VEC3,
          value: diffuseColor,
        },
        u_floodColor: {
          type: Cesium.UniformType.VEC3,
          value: floodColor,
        },
        //建筑高度
        u_flowHeight: {
          type: Cesium.UniformType.FLOAT,
          value: flowHeight,
        },
        //
        u_hierarchicalLineWidth: {
          type: Cesium.UniformType.FLOAT,
          value: hierarchicalLineWidth,
        },
        //
        u_dividerLevelHeight: {
          type: Cesium.UniformType.FLOAT,
          value: dividerLevelHeight,
        },
        //粗糙程度
        u_roughness: {
          type: Cesium.UniformType.FLOAT,
          value: roughness,
        },
        //环境遮蔽开启
        u_occlusion: {
          type: Cesium.UniformType.FLOAT,
          value: occlusion,
        },
      },
      fragmentShaderText: [
        `                
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
          vec3 positionMC = fsInput.attributes.positionMC;
          vec3 color = u_diffuseColor;
          float emissiveFactor = czm_lightIntensity;
          float iTime = fract((czm_frameNumber / 1000.0)*u_speed);
          if(czm_lightIntensity < 0.6){
            emissiveFactor=1.0-emissiveFactor;
            color *= positionMC.z / (u_flowHeight) + color * 0.1;
          }else{
            color *= positionMC.z / (u_flowHeight) + color * 0.3;
          }
          float diff = step(u_hierarchicalLineWidth, mod(positionMC.z, u_dividerLevelHeight));
          color = color + color * (1.0 - diff);
      
          float floodDiff = step(0.005, abs(clamp(positionMC.z / u_flowHeight, 0.0, 1.0) - iTime));
          color += u_floodColor * (1.0 - floodDiff);
        
          material.diffuse = color;
          material.emissive = color * emissiveFactor;
          material.occlusion = u_occlusion;
          material.roughness = u_roughness;                       
          material.emissive = czm_srgbToLinear(material.emissive);
          material.diffuse = czm_srgbToLinear(material.diffuse);     
      }
       `,
      ],
    });
    return customShader;
  }
}
window.FlowFloodLightShader=FlowFloodLightShader;
//#endregion
