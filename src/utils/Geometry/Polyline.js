/**
 * @Description: 线
 * @Author: Pensiveant
 * @Date: 2023-03-29 10:19:03
 */

class Polyline extends Cesium.Entity {
  constructor(name, positions, options) {
    super({
      name,
      positions,
      polyline: {
        ...options,
      },
    });
  }
}

export default Polyline;
