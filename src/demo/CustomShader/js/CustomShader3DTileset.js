// const Cesium = require("cesium"); // 智能提示使用

// 初始化view
Cesium.Ion.defaultAccessToken = defaultAccessToken;
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
//const tileset=await Cesium.Cesium3DTileset.fromUrl("http://172.18.80.57/models-rest/rest/models/preview/GDSGZSBMFULL20230217/tileset.json")
window.tileset = tileset;
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);

function setCustomShader(type) {
  let customShader;
  if (type === "flow") {
    customShader = new FlowFloodLightShader();
  } else if (type === "height") {
    customShader = new HeightHierarchyShader();
  }
  tileset.customShader = customShader;
}

window.setCustomShader = setCustomShader;
(viewer.postProcessStages.bloom.enabled = true),
  //#region 泛光纹理
  (window.FlowFloodLightShader = class FlowFloodLightShader {
    constructor(options) {
      this.diffuseColor = Cesium.Color.fromCssColorString("#1890ff"); // 漫反射颜色
      this.floodColor = Cesium.Color.fromCssColorString("red"); // 泛光颜色
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

          // float emissiveFactor = czm_lightIntensity;
          // if(czm_lightIntensity < 0.6){
          //   emissiveFactor=1.0-emissiveFactor;
          //   color *= positionMC.z / (u_flowHeight) + color * 0.1;
          // }else{
          //   color *= positionMC.z / (u_flowHeight) + color * 0.3;
          // }

          color *= positionMC.z / (u_flowHeight) + color * 0.3;

          // 设置间隔线
          float diff = step(u_hierarchicalLineWidth, mod(positionMC.z, u_dividerLevelHeight));
          color = color + color * (1.0 - diff);

          // 设置泛光线
          float iTime = fract((czm_frameNumber / 1000.0)*u_speed);
          float floodDiff = step(0.005, abs(clamp(positionMC.z / u_flowHeight, 0.0, 1.0) - iTime));
          color += u_floodColor * (1.0 - floodDiff);
        
          material.diffuse = color;
          material.emissive = color * 1.0;
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
  });
window.FlowFloodLightShader = FlowFloodLightShader;
//#endregion

//#region 高度分层纹理

window.HeightHierarchyShader = class HeightHierarchyShader {
  constructor(options) {
    this.diffuseColor = Cesium.Color.fromCssColorString("#f00");
    this.dividerLevelHeight = 30.0;
    this.hierarchicalLineWidth = 0.5;
    // 4*4个
    let colors = [
      Cesium.Color.fromCssColorString("#f00"),
      Cesium.Color.fromCssColorString("#0f0"),
      Cesium.Color.fromCssColorString("#00f"),
      Cesium.Color.fromCssColorString("#ff0"),

      Cesium.Color.fromCssColorString("#fff"),
      Cesium.Color.fromCssColorString("#000"),
      Cesium.Color.fromCssColorString("#0ff"),
      Cesium.Color.fromCssColorString("#f0f"),

      Cesium.Color.fromCssColorString("#aaa"),
      Cesium.Color.fromCssColorString("#bbb"),
      Cesium.Color.fromCssColorString("#ccc"),
      Cesium.Color.fromCssColorString("#ddd"),

      Cesium.Color.fromCssColorString("#f00"),
      Cesium.Color.fromCssColorString("#0f0"),
      Cesium.Color.fromCssColorString("#00f"),
      Cesium.Color.fromCssColorString("#ff0"),
    ];
    let newHierarchyColors = [];
    for (let i = 0; i < colors.length; i++) {
      newHierarchyColors = newHierarchyColors.concat(colors[i].toBytes());
    }
    this._hierarchyColors = newHierarchyColors;
    let shader = this._init(this);
    return shader;
  }

  _init(options) {
    const {
      diffuseColor,
      dividerLevelHeight,
      hierarchicalLineWidth,
      _hierarchyColors: hierarchyColors,
    } = options;

    let width = 4;
    let height = 4;
    const textureFromTypedArray = new Cesium.TextureUniform({
      typedArray: new Uint8Array(hierarchyColors),
      width,
      height,
      repeat: false,
      pixelFormat: Cesium.PixelFormat.RGBA,
      pixelDatatype: Cesium.PixelDatatype.UNSIGNED_BYTE,
    });

    let shader = new Cesium.CustomShader({
      uniforms: {
        //自定义贴图1
        u_hierarchyColors: {
          type: Cesium.UniformType.SAMPLER_2D,
          value: textureFromTypedArray,
        },
        //填充颜色
        u_diffuseColor: {
          type: Cesium.UniformType.VEC3,
          value: diffuseColor,
        },
        //楼层间隔高度
        u_dividerLevelHeight: {
          type: Cesium.UniformType.FLOAT,
          value: dividerLevelHeight,
        },
        //楼层线宽
        u_hierarchicalLineWidth: {
          type: Cesium.UniformType.FLOAT,
          value: hierarchicalLineWidth,
        },
      },
      fragmentShaderText: `     
          vec3 getColor(vec3 position,vec3 color,float dividerLevelHeight) {                                                                            
              float index = ceil(position.z / dividerLevelHeight)-1.0;
              float row = floor(index/4.0);  
              float cloumn= mod(index,4.0);
              float u =0.125+0.25*cloumn;
              float v =0.125+0.25*row;
              vec3 imageColor = texture(u_hierarchyColors, vec2(u,v)).xyz;  
              color = imageColor;                                                                  
              return color;
          }
        //获取材质参数              
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
          vec3 positionMC = fsInput.attributes.positionMC;             
          vec3 color = u_diffuseColor;                                                                                  
          vec3 heightColor = getColor(positionMC,color,u_dividerLevelHeight);
          if(heightColor != color) {
              color = heightColor;
          }
          float diff = step(u_hierarchicalLineWidth, mod(positionMC.z, u_dividerLevelHeight));
          color  = color + color * (1.0 - diff);  
          
          material.diffuse = color;     
          material.emissive = color * 0.2;                                                                                                                        
        }    
    `,
    });
    return shader;
  }
};

//#endregion
