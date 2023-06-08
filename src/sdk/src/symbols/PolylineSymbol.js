import Symbol from "./Symbol.js";

class PolylineSymbol extends Symbol {
  constructor(options) {
    super();
    this.width = options?.width || 1.0;
    this.material = options?.material || Cesium.Color.WHITE;
  }
}

export default PolylineSymbol;
