import Geometry from "./Geometry.js";

class Polyline extends Geometry {
  constructor(options) {
    super();

    this.type = "polyline";
    this.paths = options?.paths || [];
  }
}

export default Polyline;
