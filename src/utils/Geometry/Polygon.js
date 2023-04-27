/**
 * @Description: 面
 * @Author: Pensiveant
 * @Date: 2023-03-29 10:24:25
 */

let polygonAttr = {
  material: Cesium.Color.RED.withAlpha(0.4),
  outline: true,
  outlineWidth: 10,
  fill: true,
  outlineColor: Cesium.Color.RED,
};

class Polygon extends Cesium.Entity {
  constructor(name, positions, options) {
    super({
      name,
      polygon: {
        hierarchy: positions,
        ...options,
        ...polygonAttr,
      },
    });
  }
}

export default Polygon;
