const viewModelOptions = {
  emissionRate: 80.0,
  gravity: -9.8,
  minimumParticleLife: 6.0,
  maximumParticleLife: 7.0,
  minimumSpeed: 9.0,
  maximumSpeed: 9.5,
  startScale: 1.0,
  endScale: 18.0,
  particleSize: 8.0,
  transX: 2.5,
  transY: 4.0,
  transZ: 1.0,
  heading: 0.0,
  pitch: 0.0,
  roll: 0.0,
  fly: true,
  spin: true,
  show: true,
};

let gravityScratch = new Cesium.Cartesian3();

class FountainEffect {
  constructor(viewer, positions) {
    this.viewer = viewer;
    this.positions = positions;
    this._init(positions);
  }

  _init(positions) {
    this.viewer.scene.requestRenderMode = false;
    this.viewer.clock.shouldAnimate = true;
    for (let i = 0; i < positions.length; i++) {
      const item = positions[i];
      const { lon, lat, height } = item;
      let position = Cesium.Cartesian3.fromDegrees(lon, lat, height);
      this._addFountain(position);
    }
  }
  _addFountain(position) {
    let entity = this.viewer.entities.add({
      position: position,
      label: { text: "" },
    });

    let particleSystem = new Cesium.ParticleSystem({
      image: "./img/fountain.png",
      startColor: new Cesium.Color(1, 1, 1, 0.6), //粒子出生时的颜色
      endColor: new Cesium.Color(0.8, 0.8, 1, 0.4), //当粒子死亡时的颜色
      startScale: viewModelOptions.startScale, //粒子出生时的比例，相对于原始大小
      endScale: viewModelOptions.endScale, //粒子在死亡时的比例
      minimumParticleLife: viewModelOptions.minimumParticleLife, //设置粒子寿命的可能持续时间的最小界限（以秒为单位），粒子的实际寿命将随机生成
      maximumParticleLife: viewModelOptions.maximumParticleLife, //设置粒子寿命的可能持续时间的最大界限（以秒为单位），粒子的实际寿命将随机生成
      minimumSpeed: viewModelOptions.minimumSpeed, //设置以米/秒为单位的最小界限，超过该最小界限，随机选择粒子的实际速度。
      maximumSpeed: viewModelOptions.maximumSpeed, //设置以米/秒为单位的最大界限，超过该最大界限，随机选择粒子的实际速度。
      imageSize: new Cesium.Cartesian2(
        viewModelOptions.particleSize,
        viewModelOptions.particleSize
      ), //如果设置该属性，将会覆盖 minimumImageSize和maximumImageSize属性，以像素为单位缩放image的大小
      emissionRate: viewModelOptions.emissionRate, //每秒发射的粒子数。
      lifetime: 16.0, //多长时间的粒子系统将以秒为单位发射粒子
      emitter: new Cesium.CircleEmitter(Cesium.Math.toRadians(30.0)), //此系统的粒子发射器  共有 圆形、锥体、球体、长方体 ( BoxEmitter,CircleEmitter,ConeEmitter,SphereEmitter ) 几类
      modelMatrix: this._computeModelMatrix(entity, Cesium.JulianDate.now()), // 4x4转换矩阵，可将粒子系统从模型转换为世界坐标
      emitterModelMatrix: this._computeEmitterModelMatrix(), // 4x4转换矩阵，用于在粒子系统本地坐标系中转换粒子系统发射器
      updateCallback: this._applyGravity, // 更新函数，用于在一个时间步长后，修改粒子的属性，比如颜色、尺寸
    });
    var primitive = this.viewer.scene.primitives.add(particleSystem);
    this.viewer.flyTo(entity);
  }

  _computeModelMatrix(entity, time) {
    return entity.computeModelMatrix(time, new Cesium.Matrix4());
  }

  _computeEmitterModelMatrix() {
    var emitterModelMatrix = new Cesium.Matrix4();
    var translation = new Cesium.Cartesian3();
    var rotation = new Cesium.Quaternion();
    var hpr = new Cesium.HeadingPitchRoll();
    var trs = new Cesium.TranslationRotationScale();
    hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
    trs.translation = Cesium.Cartesian3.fromElements(
      0.0,
      0.0,
      0.0,
      translation
    );
    trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);
    return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
  }

  /**
   *
   * @param {Particle} particle  粒子对象
   * @param {number } dt  距离上次更新的时间间隔
   */
  _applyGravity(particle, dt) {
    const GRAVITATIONAL_CONSTANT = -9.8;
    const position = particle.position;
    const gravityVector = Cesium.Cartesian3.normalize(
      position,
      new Cesium.Cartesian3()
    ); // 归一化
    Cesium.Cartesian3.multiplyByScalar(
      gravityVector,
      GRAVITATIONAL_CONSTANT * dt,          //   viewModelOptions.gravity * dt,
      gravityVector
    ); // 每个分量乘以常量（GRAVITATIONAL_CONSTANT * dt）
    particle.velocity = Cesium.Cartesian3.add(
      particle.velocity,
      gravityVector,
      particle.velocity
    ); // 分量求和
  }
}

export { FountainEffect };
