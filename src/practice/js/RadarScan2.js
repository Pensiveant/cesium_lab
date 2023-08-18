// const Cesium = require("cesium");

class RadarScan {
  constructor(options) {
    this.viewer = options.viewer;
    this.position = options.position;       // 中心点坐标，[经度,纬度]
    this.scanColor = options.scanColor;     // 扫描颜色
    this.scanRadius = options.scanRadius;   // 扫描半径
    this._entity = undefined;
    this._init(this);
  }

  _init(options) {
    const { position, scanColor, scanRadius } = options;
    let _stRotation = 360;
    let _amount = 3;
    let radar = new Cesium.Entity({
      position: Cesium.Cartesian3.fromDegrees(position[0], position[1]),
      ellipse: {
        semiMajorAxis: scanRadius,
        semiMinorAxis: scanRadius,
        material: new Cesium.ImageMaterialProperty({
          image: "./img/radar.png",
          color: Cesium.Color.fromCssColorString(scanColor).withAlpha(0.7),
        }),
        height: 20.0,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString(scanColor),
        stRotation: new Cesium.CallbackProperty(function () {
          _stRotation -= _amount;
          if (_stRotation >= 360 || _stRotation <= -360) {
            _stRotation = 0;
          }
          return Cesium.Math.toRadians(_stRotation);
        }, false),
      },
    });
    this._entity = radar;
  }

  show() {
    this.viewer.entities.add(this._entity);
  }

  destroy() {
    this.viewer.entities.remove(this._entity);
  }
}

export default RadarScan;
