/**
 * @Description: 
 * @Author: Pensiveant
 * @Date: 2023-03-29 09:57:23
 * @feature: 1. 只有点的特性
 */


let pointAttr = {
  pixelSize: 5,
  color: Cesium.Color.RED,
  outlineColor: Cesium.Color.WHITE,
  outlineWidth: 2,
  disableDepthTestDistance: Number.POSITIVE_INFINITY,
};

class Point extends Cesium.Entity {
  constructor(name, position, options) {
    super({
      name,
      position,
      point: {
        ...pointAttr,
        ...options,
      },
    });
    this.options = options; // 属性
  }
}

export default Point;
