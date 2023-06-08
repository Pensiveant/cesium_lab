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
      layer._loadData().then(() => {
        this._viewer.dataSources.add(layer._data);
      });
    }
  }

  addMany(layers) {}

  remove(layer) {}
}

export default Map;
