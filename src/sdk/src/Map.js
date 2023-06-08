class Map {
  constructor(options) {
    this.basemap = options?.baseMap || [];
    this.layers = options?.layers || [];
    this.terrain = options?.terrain;
    this._viewer = undefined;
  }

  add(layer) {
    this.layers.push(layer);
    if (layer.type === "geojson") {
      layer._loadData().then((geojsonDataSouce) => {
        this._viewer.dataSources.add(geojsonDataSouce);
      });
    }
  }

  addMany(layers) {
    for (let i = 0; i < layers.length; i++) {
      this.add(layers[i]);
    }
  }

  remove(layer) {}
}

export default Map;
