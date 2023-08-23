// const Cesium = require("cesium"); // 智能提示使用

// 通过设置属性rectangle和color可以动态更新图形位置和颜色
function CustomRectanglePrimtive(options) {
  this.rectangle = options.rectangle;
  this.color = options.color;

  this._rectangle = undefined;
  this._color = new Cesium.Color(1, 0, 0, 1);
}

CustomRectanglePrimtive.prototype.getGeometry = function () {
  return new Cesium.RectangleGeometry({
    rectangle: this.rectangle,
    height: 500, // 高度
    vertexFormat: Cesium.VertexFormat.POSITION_ONLY,
  });
};

CustomRectanglePrimtive.prototype.getPrimitive = function () {
  var geometry = this.getGeometry();
  var instances = new Cesium.GeometryInstance({
    geometry: geometry,
  });

  return new Cesium.Primitive({
    geometryInstances: instances,
    releaseGeometryInstances: false,
    appearance: new Cesium.EllipsoidSurfaceAppearance({
      material: new Cesium.Material.fromType("Color", {
        color: this.color,
      }),
      renderState: {
        depthTest: {
          enabled: true,
        },
      },
    }),
    asynchronous: false,
  });
};

CustomRectanglePrimtive.prototype.update = function (
  context,
  frameState,
  commandList
) {
  if (!(this.rectangle !== this._rectangle || this.color !== this._color)) {
    if (this._primitive) {
      this._primitive.update(context, frameState, commandList);
    }
    return;
  }

  this._rectangle = this.rectangle;
  this._color = this.color;

  this._primitive = this._primitive && this._primitive.destroy();

  this._primitive = this.getPrimitive();

  if (!this._primitive) return;

  this._primitive.update(context, frameState, commandList);
};

CustomRectanglePrimtive.prototype.isDestroyed = function () {
  return false;
};

CustomRectanglePrimtive.prototype.destroy = function () {
  this._primitive = this._primitive && this._primitive.destroy();
  return Cesium.destroyObject(this);
};

export default CustomRectanglePrimtive;
