
class RadarWaveMaterialProperty {
    constructor(options) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._speed = undefined;
        this.color = options.color;
        this.speed = options.speed;
    };

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return Cesium.Material.RadarWaveMaterialType;
    }

    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
        result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
        return result
    }

    equals(other) {
        return (this === other ||
            (other instanceof RadarWaveMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed))
        )
    }
}

Object.defineProperties(RadarWaveMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed')
})

// Cesium.RadarWaveMaterialProperty = RadarWaveMaterialProperty;
Cesium.Material.RadarWaveMaterialProperty = 'RadarWaveMaterialProperty';
Cesium.Material.RadarWaveMaterialType = 'RadarWaveMaterialType';
Cesium.Material.RadarWaveMaterialSource =
    `
    uniform vec4 color;
    uniform float speed;

    #define PI 3.14159265359

    float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    czm_material czm_getMaterial(czm_materialInput materialInput){
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st;
    vec2 pos = st - vec2(0.5);
    float time = czm_frameNumber * speed / 1000.0 ;
    float r = length(pos);
    float t = atan(pos.y, pos.x) - time * 2.5;
    float a = (atan(sin(t), cos(t)) + PI)/(2.0*PI);
    float ta = 0.5;
    float v = smoothstep(ta-0.05,ta+0.05,a) * smoothstep(ta+0.05,ta-0.05,a);
    vec3 flagColor = color.rgb * v;
    float blink = pow(sin(time*1.5)*0.5+0.5, 0.8);
    flagColor = color.rgb *  pow(a, 8.0*(.2+blink))*(sin(r*500.0)*.5+.5) ;
    flagColor = flagColor * pow(r, 0.4);
    material.alpha = length(flagColor) * 1.3;
    material.diffuse = flagColor * 3.0;
    return material;
    }
     `

Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarWaveMaterialType, {
    fabric: {
        type: Cesium.Material.RadarWaveMaterialType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
            speed: 10.0
        },
        source: Cesium.Material.RadarWaveMaterialSource
    },
    translucent: function(material) {
        return true;
    }
})


export default RadarWaveMaterialProperty;