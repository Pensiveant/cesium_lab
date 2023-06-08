import Layer from "./Layer.js";

class GeoJSONLayer extends Layer {
  constructor(options) {
    super(options);

    this.type = "geojson";
    this.source = options?.source;
    this.url = options?.url;
  }

  async _loadData() {
    let geojsonDataSouce;
    if (this.source) {
      geojsonDataSouce = await Cesium.GeoJsonDataSource.load(this.source);
    }

    if (this.url) {
      geojsonDataSouce = await Cesium.Resource.fetchJson({
        url: this.url,
      });
    }
    return geojsonDataSouce;
  }
}

export default GeoJSONLayer;
