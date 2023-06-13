import Layer from "./Layer.js";

class WMSLayer extends Layer {
  constructor(options) {
    super(options);

    this.type = "wms";
    this.url = options?.url;
    this.layers = options?.layers;
    this.parameters = options?.parameters;
    this._options = options;
    this._viewer = undefined;
    this._data = undefined;
  }

  _addDataToViewer(viewer) {
    const wmsProvider = new Cesium.WebMapServiceImageryProvider({
      ...this._options,
    });
    const wmsLayer = new Cesium.ImageryLayer(wmsProvider);
    viewer.imageryLayers.add(wmsLayer);
    this._data = wmsLayer;
  }

  zoomTo() {
    
  }

  destroy() {
    this._viewer.imageryLayers.remove(this._data);
  }
}

export default WMSLayer;
