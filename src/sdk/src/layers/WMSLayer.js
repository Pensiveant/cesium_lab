import Layer from "./Layer.js";

class WMSLayer extends Layer {
  constructor(options) {
    super(options);

    this.type = "wms";
    this.url = options?.url;
    this.layers = options?.layers;
    this.parameters = options?.parameters;
    this._options = options;
  }

  _loadData() {
    if (this._data) {
      return this._data;
    }
    const wmsProvider = new Cesium.WebMapServiceImageryProvider({
      ...this._options,
    });
    const wmsLayer = new Cesium.ImageryLayer(wmsProvider);
    this._data = wmsLayer;
    return this._data;
  }

  zoomTo() {
    
  }
}

export default WMSLayer;
