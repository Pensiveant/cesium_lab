function addOneBall(positions) {
  const duration = positions.length / 4;
  const times = [];
  const points = [
    // Cesium.Cartesian3.fromDegrees(113.51537042809312, 22.892144001277007),
    // Cesium.Cartesian3.fromDegrees(113.50813230765714, 22.906403588969297,),
    // Cesium.Cartesian3.fromDegrees(113.50073976689038, 22.92800324426797,),
    // Cesium.Cartesian3.fromDegrees(113.49918650115374, 22.95071158889064,),
    // Cesium.Cartesian3.fromDegrees(113.5103434794479, 22.980535040688387),
  ];

  for (let i = 0, len = positions.length; i < len; i++) {
    let point = positions[i];
    points.push(Cesium.Cartesian3.fromDegrees(point[0], point[1]));
    times.push(i);
  }

  const firstTime = times[0];
  const lastTime = times[times.length - 1];
  const delta = lastTime - firstTime;
  const before = points[0];
  const after = points[points.length - 1];

  const firstTangent = Cesium.Cartesian3.subtract(
    points[0],
    before,
    new Cesium.Cartesian3()
  );
  const lastTangent = Cesium.Cartesian3.subtract(
    after,
    points[points.length - 1],
    new Cesium.Cartesian3()
  );

  const positionSpline = new Cesium.CatmullRomSpline({
    times: times,
    points: points,
    firstTangent: firstTangent,
    lastTangent: lastTangent,
  });
  const start = Cesium.JulianDate.now();
  const position = new Cesium.CallbackPositionProperty(function (time, result) {
    const splineTime =
      (delta * Cesium.JulianDate.secondsDifference(time, start)) / duration;
    if (splineTime < firstTime || splineTime > lastTime) {
      return undefined;
    }
    return positionSpline.evaluate(splineTime, result);
  }, false);
  // const radius = Math.random() * 30 + 20;
  const radius = .5;
  let ballEntity = new Cesium.Entity({
    position,
    ellipsoid: {
      radii: new Cesium.Cartesian3(radius, radius, radius),
      material: Cesium.Color.fromCssColorString("rgba(0, 222, 255, 1)"),
    },
  });
  viewer.entities.add(ballEntity);
}

function showOneLine(linePoints) {
  //   let linePoints = [
  //     [113.51537042809312, 22.892144001277007],
  //     [113.50813230765714, 22.906403588969297],
  //     [113.50073976689038, 22.92800324426797],
  //     [113.49918650115374, 22.95071158889064],
  //     [113.5103434794479, 22.980535040688387],
  //   ];
 let length = linePoints.length;
  var controls = [
    // Cesium.Cartesian3.fromDegrees(110, 10),
    // Cesium.Cartesian3.fromDegrees(111, 11),
    // Cesium.Cartesian3.fromDegrees(112, 9),
    // Cesium.Cartesian3.fromDegrees(114, 10),
    // Cesium.Cartesian3.fromDegrees(113, 8)
  ];
  const times = [];
  for (let i = 0; i < linePoints.length; i++) {
    const item = linePoints[i];
    controls.push(Cesium.Cartesian3.fromDegrees(item[0], item[1]));
    times.push(i);
  }
  var spline = new Cesium.LinearSpline({
    times: times,
    points: controls,
  });
  var positions = [];
  let count=length*2; // 插值点数量
  for (var i = 0; i <= count; i++) {
    var cartesian3 = spline.evaluate(i / count);
    // cartesian3 转经纬度，单位为度
    let lonlat = Cesium.Cartographic.fromCartesian(cartesian3);
    positions.push([
      Cesium.Math.toDegrees(lonlat.longitude),
      Cesium.Math.toDegrees(lonlat.latitude),
    ]);
    // viewer.entities.add({
    //   position: cartesian3,
    //   point: {
    //     color: Cesium.Color.YELLOW,
    //     pixelSize: 6
    //   }
    // });
  }

  for (let i = 0; i < positions.length - 1; i++) {
    addOneBall(positions.slice(i, positions.length));
  }
}

export { showOneLine };
