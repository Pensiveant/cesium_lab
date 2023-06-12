class Map {
  constructor(options) {
    this.basemap = options?.baseMap || [];
    this.layers = options?.layers || [];
    this.terrain = options?.terrain;
    this._viewer = undefined;
  }

  add(layer) {
    this.layers.push(layer);
    layer._viewer = this._viewer;
    if (layer.type === "geojson") {
      layer._loadData().then((geojsonDataSouce) => {
        this._viewer.dataSources.add(geojsonDataSouce);
      });
    }
    if (layer.type === "wms") {
      let data = layer._loadData();
      this._viewer.imageryLayers.add(data);
    }
    // 调用每个图层的_addDataToViewer() 方法，将数据添加到viewer
    layer._addDataToViewer(this._viewer);
  }

  addMany(layers) {
    for (let i = 0; i < layers.length; i++) {
      this.add(layers[i]);
    }
  }

  remove(layer) {
    layer.destroy();
    
    const layers = this.layers;
    for (let i = 0, len = layers.length; i < len; i++) {
      if (layer.id === layers[i].id) {
        layers.splice(i, 1);
      }
    }
  }
}

export default Map;
