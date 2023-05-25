/**
 * @Description: 绘图工具
 * @Author: Pensiveant
 * @Date: 2023-05-25 10:52:07
 */
import PickerHelper from "./PickerHelper.js";
import EventHelper from "./EventHelper.js";
import FeatureLayer from "./Layer/FeatureLayer.js";

class Draw {
  constructor(viewer) {
    this.viewer = viewer;
    this._pickerHelper = new PickerHelper(this.viewer);
    this._eventHelper = new EventHelper(this.viewer);
    this._featureLayer = new FeatureLayer(this.viewer);
  }

  async drawPoint() {
    // 改变鼠标样式
    this._pickerHelper.setCursor("crosshair");
    const that = this;
    this._eventHelper.on("LEFT_CLICK", (evt) => {
      let { position } = that._pickerHelper.hitTest(evt);
      let point = new Cesium.Entity({
        name: "点",
        position,
        point: {
          pixelSize: 5,
          color: Cesium.Color.RED,
          outlineColor: Cesium.Color.WHITE,
          outlineWidth: 2,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // 贴地
        },
      });
      this._featureLayer.addEntity(point);
      
      return {
        positions: position,
        entity: point,
      };
    });
  }

  drawPolyline() {
    
  }

  drawPolygon() {}

  drawRect() {}

  drawCircle() {}

  destroy() {
    this._pickerHelper.setCursor("default");
    this._eventHelper.off();
    this._featureLayer.destroy();
  }
}

export default Draw;
