import Layer from "./Layer.js";
import { bbox } from "../Helper.js";

class GeoJSONLayer extends Layer {
  constructor(options) {
    super(options);

    this.type = "geojson";
    this.source = options?.source;
    this.url = options?.url;
    this._init();
  }

  _init() {
    // 初始化范围
    let extent = bbox(this.source);
    this.extent = {
      xmin: extent[0],
      xmax: extent[2],
      ymin: extent[1],
      ymax: extent[3],
    };
  }

  async _loadData() {
    if (this._data) {
      return this._data;
    }
    let geojsonDataSouce;
    if (this.source) {
      geojsonDataSouce = await Cesium.GeoJsonDataSource.load(this.source);
    }

    if (this.url) {
      geojsonDataSouce = await Cesium.Resource.fetchJson({
        url: this.url,
      });
    }
    this._data = geojsonDataSouce;
    return geojsonDataSouce;
  }

  zoomTo(viewer) {
    viewer.flyTo(this._data);
  }
}

export default GeoJSONLayer;
