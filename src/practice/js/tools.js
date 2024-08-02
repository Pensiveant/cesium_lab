// https://github.com/ren5927/CesiumDarkMap
export function modifyMap(viewer, options) {
  const baseLayer = viewer.imageryLayers.get(1);
  //以下几个参数根据实际情况修改,目前我是参照火星科技的参数,个人感觉效果还不错
  baseLayer.brightness = options.brightness || 0.6;
  baseLayer.contrast = options.contrast || 1.8;
  baseLayer.gamma = options.gamma || 0.3;
  baseLayer.hue = options.hue || 1;
  baseLayer.saturation = options.saturation || 0;
  const baseFragShader =
    viewer.scene.globe._surfaceShaderSet.baseFragmentShaderSource.sources;
  for (let i = 0; i < baseFragShader.length; i++) {
    const strS = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    let strT = "color = czm_saturation(color, textureSaturation);\n#endif\n";
    if (options.invertColor) {
      strT += `
                    color.r = 1.0 - color.r;
                    color.g = 1.0 - color.g;
                    color.b = 1.0 - color.b;
                    `;
    }
    if (options.filterRGB.length > 0) {
      strT += `
                    color.r = color.r * ${options.filterRGB[0]}.0/255.0;
                    color.g = color.g * ${options.filterRGB[1]}.0/255.0;
                    color.b = color.b * ${options.filterRGB[2]}.0/255.0;
                    `;
    }
    baseFragShader[i] = baseFragShader[i].replace(strS, strT);
  }
}

/**
 * 自定义Popu
 */
export class FloatInfoBox {
  constructor(viewer) {
    this.viewer = viewer;
    this.listen = null;
  }
  /**
   * 添加信息框
   * @param {*} dom html内容  this.$refs.popBox1 || document.getElementById('popBox')
   * @param {*} position 位置  Cesium.Cartesian3.fromDegrees(113.31958097, 23.11418033, 0)
   * @param {*} option  可选参数
   *  可选：
   *  distanceDisplayCondition 根据地图层级控制自动隐藏  1000000
   */
  add(dom, position, option) {
    let _this = this;
    let _opt = {
      dom: dom,
      position: position,
      distanceDisplayCondition: option && option.distanceDisplayCondition,
      xoffset: option?.xoffset || 0,
      yoffset: option?.yoffset || 0,
    };
    if (this.listen) {
      this.remove();
    }
    this.listen = function () {
      _this.refreshPosition(_opt);
    };
    _this.viewer.scene.postRender.addEventListener(this.listen);
    this.dom = dom;
  }
  /**
   * 更新点在地图里的位置
   * @param {Object} option { dom: "div节点", position: "div位置", distanceDisplayCondition: "可见视高"}
   * @private
   */
  refreshPosition(option) {
    const canvasHeight = this.viewer.scene.canvas.height;
    const windowPosition = new Cesium.Cartesian2();
    Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      option.position,
      windowPosition
    );
    option.dom.style.position = "absolute";
    option.dom.style.top =
      windowPosition.y - option.dom.offsetHeight - option.yoffset + "px";
    const elWidth = option.dom.offsetWidth || option.dom.scrollWidth;
    option.dom.style.left =
      windowPosition.x - elWidth / 2 - option.xoffset + "px";
    if (option.distanceDisplayCondition) {
      if (
        this.viewer.camera.positionCartographic.height >
        option.distanceDisplayCondition
      ) {
        option.dom.style.display = "block";
      } else {
        option.dom.style.display = "none";
      }
    }
  }
  /**
   * remove 移除事件
   */
  remove() {
    this.viewer.scene.postRender.removeEventListener(this.listen);
  }

  setVisible(visible) {
    if (visible) {
      this.dom.style.display = "flex";
    } else {
      this.dom.style.display = "none";
    }
  }
}
