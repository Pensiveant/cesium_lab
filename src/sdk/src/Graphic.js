class Graphic {
  constructor(options) {
    this.geometry = options?.geometry;
    this.attributes = options?.attributes;
    this.symbol = options?.symbol;
    this._entities = [];
    this._setEntities();
  }

  _setEntities() {
    if (this.geometry.type === "point") {
      const entity = new Cesium.Entity({
        position: this.geometry._position,
        point: {
          ...this.symbol,
        },
      });
      this._entities.push(entity);
    } else if (this.geometry.type === "polyline") {
      const { paths } = this.geometry;
      for (let i = 0; i < paths.length; i++) {
        const entityItem = new Cesium.Entity({
          polyline: {
            positions: paths[i],
            ...this.symbol,
          },
        });
        this._entities.push(entityItem);
      }
    } else if (this.geometry.type === "polygon") {
      const entity = new Cesium.Entity({
        polygon: {
          hierarchy: {
            ...this.geometry,
          },
          ...this.symbol,
        },
      });
      this._entities.push(entity);
    }
  }
}

export default Graphic;
