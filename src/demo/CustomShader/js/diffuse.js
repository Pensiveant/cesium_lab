// const Cesium = require("cesium"); // 智能提示使用

import createViewer from "../../js/initViewer.js"
const viewer = createViewer();


// 加载白模
let customShader = new Cesium.CustomShader({
  //
  fragmentShaderText: `                
  void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
    material.diffuse = vec3(255,0,0)+ vec3(255,0,0)*1.0;     // 只设置入反射为红色，则模型显示为红色
    // material.emissive = vec3(0,255,0);
    // material.occlusion = 0.0;
}`,
});
const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(75343);
tileset.customShader = customShader;
window.tileset = tileset;
viewer.scene.primitives.add(tileset);
viewer.zoomTo(tileset);
