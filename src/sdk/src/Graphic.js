class Graphic {
  constructor(options) {
    this.geometry = options?.geometry;
    this.attributes = options?.attributes;
    this.symbol = options?.symbol;
    this._entity = undefined;
    this._setEntity();
  }

  _setEntity() {
    if (this.geometry.type === "point") {
      this._entity = new Cesium.Entity({
        position: this.geometry._position,
        point: {
          ...this.symbol,
        },
      });
    }
  }
}

export default Graphic;
