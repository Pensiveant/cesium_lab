import GraphicsLayer from "../layers/GraphicsLayer.js";
import PickerHelper from "./PickerHelper.js";
import EventHelper from "./EventHelper.js";
import Point from "../../src/geometry/Point.js";
import PointSymbol from "../../src/symbols/PointSymbol.js";
import Graphic from "../../src/Graphic.js";

class Draw {
  constructor(options) {
    this.viewer = options?.viewer;
    this.layer = options?.layer;
    this._pickerHelper = new PickerHelper(this.viewer);
    this._eventHelper = new EventHelper(this.viewer);
    if (!this.layer) {
      this._initLayer();
    }
  }

  _initLayer() {
    let layer = new GraphicsLayer();
    this.layer = layer;
    this.viewer.map.add(layer);
  }

  drawPoint(options) {
    // 改变鼠标样式
    this._pickerHelper.setCursor("crosshair");
    const that = this;
    this._eventHelper.on("LEFT_CLICK", (evt) => {
      let { position } = that._pickerHelper.hitTest(evt);
      const { x, y, z } = position;
      let point = new Point({
        x,
        y,
        z,
      });

      let pointSymbol = new PointSymbol({
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
      });

      let pointGraphic = new Graphic({
        geometry: point,
        symbol: pointSymbol,
      });

      this.layer.add(pointGraphic);
      if (typeof options?.clickCallback === "function") {
        clickCallback(pointGraphic);
      }
    });
    this._eventHelper.on("LEFT_DOUBLE_CLICK", () => {
      that._pickerHelper.setCursor("default");
      that._removeAllEvent();
    });
  }

  drawPolyline() {}

  drawPolygon() {}

  drawRect() {}

  drawCircle() {}

  removeAll() {
    this.layer.removeAll();
  }

  destroy() {
    this.layer.destroy();
    this._eventHelper.off();
    that._pickerHelper.setCursor("default");
  }

  _removeAllEvent() {
    this._eventHelper.remove("LEFT_CLICK");
    this._eventHelper.remove("RIGHT_CLICK");
    this._eventHelper.remove("MOUSE_MOVE");
    this._eventHelper.remove("LEFT_DOUBLE_CLICK");
  }
}

export default Draw;
