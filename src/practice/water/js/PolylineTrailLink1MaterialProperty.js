function PolylineTrailLink1MaterialPropertyInit() {
  const repeat = 1;
  const MaterialPropertyType = "PolylineTrailLink1";

  function PolylineTrailLink1MaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = new Date().getTime();
  }
  Object.defineProperties(PolylineTrailLink1MaterialProperty.prototype, {
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
  PolylineTrailLink1MaterialProperty.prototype.getType = function (time) {
    return MaterialPropertyType;
  };
  PolylineTrailLink1MaterialProperty.prototype.getValue = function (
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
    result.image = Cesium.Material.PolylineTrailLink1Image;
    result.time =
      ((new Date().getTime() - this._time) % this.duration) / this.duration;
    return result;
  };
  PolylineTrailLink1MaterialProperty.prototype.equals = function (other) {
    return (
      this === other ||
      (other instanceof PolylineTrailLink1MaterialProperty &&
        Property.equals(this._color, other._color))
    );
  };

  Cesium.PolylineTrailLink1MaterialProperty =
    PolylineTrailLink1MaterialProperty;
  Cesium.Material.PolylineTrailLink1Type = MaterialPropertyType;
  Cesium.Material.PolylineTrailLink1Image = "./img/arrow1.png";
  Cesium.Material.PolylineTrailLink1Source =
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
    Cesium.Material.PolylineTrailLink1Type,
    {
      fabric: {
        type: Cesium.Material.PolylineTrailLink1Type,
        uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
          image: Cesium.Material.PolylineTrailLink1Image,
          time: 1000,
          repeat: new Cesium.Cartesian2(repeat, 1),
        },
        source: Cesium.Material.PolylineTrailLink1Source,
      },
      translucent: function (material) {
        return true;
      },
    }
  );
}

export default PolylineTrailLink1MaterialPropertyInit;
