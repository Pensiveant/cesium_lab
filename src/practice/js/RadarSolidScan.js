class RadarSolidScan {
  constructor(options) {
    this._viewer = options.viewer;
    // 半径
    this._radius = options.radius;
    // 扫描扇形颜色
    this._color = options.color;
    // 扫描速度
    this._speed = options.speed;
    // 中心点坐标经纬度
    this._cenLon = options.position[0];
    this._cenLat = options.position[1];
    this._init();
  }

  _init() {
    // 先建立椭球体
    this._viewer.entities.add({
      position: new Cesium.Cartesian3.fromDegrees(this._cenLon, this._cenLat),
      name: "立体雷达扫描",
      ellipsoid: {
        radii: new Cesium.Cartesian3(this._radius, this._radius, this._radius),
        material: Cesium.Color.fromCssColorString(this._color).withAlpha(0.3) ,
        outline: true,
        outlineColor: Cesium.Color.fromCssColorString(this._color),
        outlineWidth: 1,
      },
    });

    let heading = 0;
    let positionArr=[];
    // 每一帧刷新时调用
    this._viewer.clock.onTick.addEventListener(() => {
      heading += this._speed;
      positionArr = this.calculatePane(this._cenLon, this._cenLat, this._radius, heading);
    });

    // 创建1/4圆形立体墙
    let radarWall = this._viewer.entities.add({
      wall: {
        positions: new Cesium.CallbackProperty(() => {
          return Cesium.Cartesian3.fromDegreesArrayHeights(positionArr);
        }, false),
        material:Cesium.Color.fromCssColorString(this._color).withAlpha(0.3),
      },
    });
  }

  // 计算平面扫描范围
  calculatePane(x1, y1, radius, heading) {
    var m = Cesium.Transforms.eastNorthUpToFixedFrame(
      Cesium.Cartesian3.fromDegrees(x1, y1)
    );
    var rx = radius * Math.cos((heading * Math.PI) / 180.0);
    var ry = radius * Math.sin((heading * Math.PI) / 180.0);
    var translation = Cesium.Cartesian3.fromElements(rx, ry, 0);
    var d = Cesium.Matrix4.multiplyByPoint(
      m,
      translation,
      new Cesium.Cartesian3()
    );
    var c = Cesium.Cartographic.fromCartesian(d);
    var x2 = Cesium.Math.toDegrees(c.longitude);
    var y2 = Cesium.Math.toDegrees(c.latitude);
    return this.calculateSector(x1, y1, x2, y2);
  }

  // 计算竖直扇形
  calculateSector(x1, y1, x2, y2) {
    let positionArr = [];
    positionArr.push(x1);
    positionArr.push(y1);
    positionArr.push(0);
    var radius = Cesium.Cartesian3.distance(
      Cesium.Cartesian3.fromDegrees(x1, y1),
      Cesium.Cartesian3.fromDegrees(x2, y2)
    );
    // 扇形是1/4圆，因此角度设置为0-90
    for (let i = 0; i <= 90; i++) {
      let h = radius * Math.sin((i * Math.PI) / 180.0);
      let r = Math.cos((i * Math.PI) / 180.0);
      let x = (x2 - x1) * r + x1;
      let y = (y2 - y1) * r + y1;
      positionArr.push(x);
      positionArr.push(y);
      positionArr.push(h);
    }
    return positionArr;
  }
}

export default RadarSolidScan;
