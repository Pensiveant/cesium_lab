import Geometry from "./Geometry.js";

class Point extends Geometry {
  constructor(options) {
    super();
    this.type = "point";
    this.x = options?.x;
    this.y = options?.y;
    this.z = options?.z;
    this.latitude = options?.latitude;
    this.longitude = options?.longitude;
    this.height = options?.height || 0;
    this.isCartesian = false;
    this.isCartographic = false;
    this._position = undefined;
    this._setPointType();
    this._setPosition();
  }

  // 判断点的类型
  _setPointType() {
    const { latitude, longitude, x, y, z } = this;
    if (latitude && longitude) {
      this.isCartographic = true;
    }

    if (x && y && z) {
      this.isCartesian = true;
    }
  }

  _setPosition() {
    if (this.isCartographic) {
      const { longitude, latitude, height } = this;
      this._position = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
      );
    }

    if (this.isCartesian) {
      const { x, y, z } = this;
      this._position = new Cesium.Cartesian3(x, y, z);
    }
  }
}

export default Point;
