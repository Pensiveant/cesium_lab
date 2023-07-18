import writeTextToCanvas from "./writeTextToCanvas.js";

class RoadAnnotationLayer {
  constructor(options) {
    this.data = options?.data;
    this.viewer = options?.viewer;
    this._entities = [];
    this._roadCallProperty = new Map();
    this._init(this.data);
  }

  _init(data) {
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      const { name, startPoint, endPoint } = item;

      const { position, angle, isColumn } = this.computeAngle(
        startPoint,
        endPoint
      );
      const roadEntity = this.createRoadLabelEntity(
        name,
        position,
        angle,
        isColumn
      );
      roadEntity._customInfo = {
        ...roadEntity._customInfo,
        startPoint,
        endPoint,
      };

      this.viewer.entities.add(roadEntity);
      this._entities.push(roadEntity);
      this._removeEventListener = this.viewer.camera.changed.addEventListener(
        () => {
          this.updateRenderRoadLabel(this._entities);
        }
      );
    }
  }

  computeAngle(start, end) {

    //#region 假设方位角为0度，考虑不同方向的道路注记如何显示
    var point1 = turf.point(start);
    var point2 = turf.point(end);
    var bearing = turf.rhumbBearing(point1, point2); // 计算方位角[-180~180]
    bearing = turf.bearingToAzimuth(bearing); // 转换为0~360
    let angle = bearing - 90; // 方位角为0时，文本是水平显示，需要逆时针旋转90度
    if (bearing > 180) {
      // 大于180，阅读为从右往左，与从左往右相反，所以加180
      angle += 180;
    }

    // 文本需要垂直显示
    let isColumn = false;
    if (bearing >= 0 && bearing <= 45) {
      isColumn = true;
      angle += 90;
    } else if (bearing > 135 && bearing <= 180) {
      isColumn = true;
      angle -= 90;
    } else if (bearing > 180 && bearing <= 225) {
      isColumn = true;
      angle += 90;
    } else if (bearing > 315 && bearing <= 360) {
      isColumn = true;
      angle -= 90;
    }
    //#endregion

    // 考虑初始方位角不是0，以及地图交互操作，heading改变的影响
    const preHeading = 0;
    const preHeadingAngle = Cesium.Math.toDegrees(preHeading);
    const heading = this.viewer.camera.heading;
    const angeleDx = Cesium.Math.toDegrees(heading);
    if (
      Math.abs(angeleDx) > 225 &&
      Math.abs(angeleDx) <= 315 &&
      !(Math.abs(preHeadingAngle) > 225 && Math.abs(preHeadingAngle) <= 315)
    ) {
      angle += 270;
      isColumn = !isColumn;
    } else if (
      Math.abs(angeleDx) > 135 &&
      Math.abs(angeleDx) <= 225 &&
      !(Math.abs(preHeadingAngle) > 135 && Math.abs(preHeadingAngle) <= 225)
    ) {
      angle += 180;
      // isColumn = !isColumn;
    } else if (
      Math.abs(angeleDx) > 45 &&
      Math.abs(angeleDx) < 135 &&
      !(Math.abs(preHeadingAngle) > 45 && Math.abs(preHeadingAngle) <= 135)
    ) {
      angle += 90;
      isColumn = !isColumn;
    }

    return {
      position: start,
      angle,
      isColumn,
    };
  }

  createRoadLabelEntity(text, location, angle = 0, isColumn = false) {
    const img = writeTextToCanvas(text, {
      padding: 2,
      fill: true,
      fillColor: Cesium.Color.RED,
      font: "12px sans-serif",
      // textBaseline:"top"
      column: isColumn,
    });
    const position = Cesium.Cartesian3.fromDegrees(location[0], location[1], 0);
    var heading = Cesium.Math.toRadians(angle);
    var pitch = Cesium.Math.toRadians(0.0);
    var roll = Cesium.Math.toRadians(0.0);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );
    const key = Cesium.createGuid();
    this._roadCallProperty.set(key, {
      img,
      orientation,
    });
    const label = new Cesium.Entity({
      position: position,
      orientation: new Cesium.CallbackProperty(() => {
        const { orientation } = this._roadCallProperty.get(key);
        return orientation;
      }, false),
      plane: {
        plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0.0),
        dimensions: new Cesium.CallbackProperty(() => {
          const { img } = this._roadCallProperty.get(key);
          return new Cesium.Cartesian2(img.width, img.height);
        }, false),
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.CallbackProperty(() => {
            const { img } = this._roadCallProperty.get(key);
            return img;
          }, false),
          transparent: true,
        }),
        outline: false,
        clampToGround: true,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      },
    });
    label._customInfo = {
      _isRoadText: true,
      name: text,
      _roadCallPropertyKey: key,
    };
    return label;
  }

  updateRenderRoadLabel(entities) {
    for (let i = 0; i < entities.length; i++) {
      const item = entities[i];
      const { startPoint, endPoint, name, _roadCallPropertyKey } =
        item._customInfo;
      const {
        position: location,
        angle,
        isColumn,
      } = this.computeAngle(startPoint, endPoint);
      const img = writeTextToCanvas(name, {
        padding: 2,
        fill: true,
        fillColor: Cesium.Color.RED,
        font: "30px sans-serif",
        // textBaseline:"top"
        column: isColumn,
      });
      const position = Cesium.Cartesian3.fromDegrees(
        location[0],
        location[1],
        0
      );
      var heading = Cesium.Math.toRadians(angle);
      var pitch = Cesium.Math.toRadians(0.0);
      var roll = Cesium.Math.toRadians(0.0);
      var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
      var orientation = Cesium.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      );
      this._roadCallProperty.set(_roadCallPropertyKey, {
        orientation,
        img,
      });
    }
  }
}

export default RoadAnnotationLayer;
