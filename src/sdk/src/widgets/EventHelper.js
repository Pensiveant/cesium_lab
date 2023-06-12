class EventHelper {
  constructor(viewer) {
    this.viewer = viewer;
    this._eventHandler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );
  }

  /**
   * 绑定事件
   * @param {*} type 
   * @param {*} handler 
   */
  on(type, handler) {
    this._eventHandler.setInputAction(
      handler,
      Cesium.ScreenSpaceEventType[type]
    );
  }

  /**
   * 移除事件
   * @param {*} type 
   */
  remove(type) {
    if (this._eventHandler) {
      this._eventHandler.removeInputAction(Cesium.ScreenSpaceEventType[type]);
    }
  }

  /**
   * 移除元素上绑定的所有事件
   */
  off() {
    if (this._eventHandler && !this._eventHandler.isDestroyed()) {
      this._eventHandler.destroy();
    }
  }
}

export default EventHelper;
