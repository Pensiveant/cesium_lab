import { guid } from "../Helper.js";

class Layer {
  constructor(options) {
    this.type = "layer";
    this.id = options?.id || guid();
    this.visible = options?.visible || true;
    this.opacity = options?.opacity || 1;
    this.fullExtent = options?.fullExtent;
  }
  destroy() {}
}

export default Layer;
