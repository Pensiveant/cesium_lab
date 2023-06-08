import Layer from "./Layer.js";

class GeoJSONLayer extends Layer {
  constructor(options) {
    super(options);
    this.source = options?.source;
    this.url = options?.url;
  }
}

export default GeoJSONLayer;
