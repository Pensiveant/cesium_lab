class PickerHelper {
  constructor(viewer) {
    this.viewer = viewer;
  }

  /**
   * 设置鼠标样式
   * @param {*} type
   */
  setCursor(type) {
    this.viewer.container.style.cursor = type;
  }

  /**
   *
   * @param {*} e
   * @param {*} exclude
   * @param {*} limit
   * @returns
   */
  hitTest(e, exclude, limit = 0) {
    let result = {
      screenPosition: undefined, // 屏幕坐标
      position: undefined,    // 拾取点，笛卡尔坐标
      results: [],
    };
    result.screenPoint = e.position || e.endPosition;
    let isDepthTest = this.viewer.scene.globe.depthTestAgainstTerrain;
    if (!isDepthTest || this.viewer.scene.mode === Cesium.SceneMode.SCENE2D) {
      //没有深度检测情况下，不能用pickPostion、pickFromRay等方法，直接使用地形拾取
      result.position = this.getPositionByRay(result.screenPoint);
    }
    return result;
  }

  /**
   * 通过射线，获取鼠标拾取点，在椭球体表面的笛卡尔坐标。
   * @param {Cartesian2} position 屏幕坐标
   * @returns {Cartesian3}
   */
  getPositionByRay(position) {
    let ray = this.viewer.camera.getPickRay(position); // 创建一条光线，起点为相机位置，穿过给定坐标（e.position）的像素
    let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene); // 获取光线与椭球体表面的交点，交点的坐标为笛卡尔坐标（Cartesian3）。
    return cartesian;
  }
}

export default PickerHelper;
