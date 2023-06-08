import Layer from "./Layer.js";

class GeoJSONLayer extends Layer {
  constructor(options) {
    super(options);

    this.type = "geojson";
    this.source = options?.source;
    this.url = options?.url;
    this._data;
  }

  async _loadData() {
    let geojsonDataSouce;
    if (this.source) {
      geojsonDataSouce = await Cesium.GeoJsonDataSource.load(this.source);
    }

    this._data = geojsonDataSouce;
  }
}

export default GeoJSONLayer;
