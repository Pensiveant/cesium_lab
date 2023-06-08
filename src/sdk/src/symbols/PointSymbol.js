import Symbol from "./Symbol.js";

class PointSymbol extends Symbol {
  constructor(options) {
    super();
    this.pixelSize = options?.pixelSize || 1;
    this.color = options?.color || Cesium.Color.WHITE;
    this.outlineColor = options?.outlineColor || Cesium.Color.BLACK;
    this.outlineWidth = options?.outlineWidth || 0;
  }

  toObject() {
    return {
      ...this,
    };
  }
}

export default PointSymbol;
