function PolylineTrailLink5MaterialPropertyInit() {
  const repeat = 8;
  const MaterialPropertyType = "PolylineTrailLink5";

  function PolylineTrailLink5MaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = new Date().getTime();
  }
  Object.defineProperties(PolylineTrailLink5MaterialProperty.prototype, {
    isConstant: {
      get: function () {
        return false;
      },
    },
    definitionChanged: {
      get: function () {
        return this._definitionChanged;
      },
    },
    color: Cesium.createPropertyDescriptor("color"),
  });
  PolylineTrailLink5MaterialProperty.prototype.getType = function (time) {
    return MaterialPropertyType;
  };
  PolylineTrailLink5MaterialProperty.prototype.getValue = function (
    time,
    result
  ) {
    if (!Cesium.defined(result)) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
      this._color,
      time,
      Cesium.Color.WHITE,
      result.color
    );
    result.image = Cesium.Material.PolylineTrailLink5Image;
    result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration;
    return result;
  };
  PolylineTrailLink5MaterialProperty.prototype.equals = function (other) {
    return (
      this === other ||
      (other instanceof PolylineTrailLink5MaterialProperty &&
        Property.equals(this._color, other._color))
    );
  };

  Cesium.PolylineTrailLink5MaterialProperty =
    PolylineTrailLink5MaterialProperty;
  Cesium.Material.PolylineTrailLink5Type = MaterialPropertyType;
  Cesium.Material.PolylineTrailLink5Image = "./img/arrow1.png";
  Cesium.Material.PolylineTrailLink5Source =
    "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                              {\n\
                                                   czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                   vec2 st = repeat * materialInput.st;\n\
                                                   vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\n\
                                                   material.alpha = colorImage.a * color.a;\n\
                                                   material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                   return material;\n\
                                               }";

  Cesium.Material._materialCache.addMaterial(
    Cesium.Material.PolylineTrailLink5Type,
    {
      fabric: {
        type: Cesium.Material.PolylineTrailLink5Type,
        uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
          image: Cesium.Material.PolylineTrailLink5Image,
          time: 1000,
          repeat: new Cesium.Cartesian2(repeat, 1),
        },
        source: Cesium.Material.PolylineTrailLink5Source,
      },
      translucent: function (material) {
        return true;
      },
    }
  );
}
export default PolylineTrailLink5MaterialPropertyInit;
