import Geometry from "./Geometry.js";

class Polygon extends Geometry {
  constructor(options) {
    super();
    this.type = "polygon";
    this.positions = options?.positions || [];
    this.holes = options?.holes || [];
  }
}

export default Polygon;
