import Symbol from "./Symbol.js";

class PolygonSymbol extends Symbol {
  constructor(options) {
    super();
    this.material = options?.material || Cesium.Color.WHITE;
    this.outline = options?.outline || false;
    this.outlineColor = options?.outlineColor || Cesium.Color.BLACK;
    this.outlineWidth = options?.outlineWidth || 1.0;
  }
}

export default PolygonSymbol;
