/**
 * 全景图
 */
class Panorama {
  constructor(options) {
    this.viewer = options.viewer || viewer;
    this.panoramaUrl = options.panoramaUrl;
    this.position = options.position;
    this.THREE = options.THREE || THREE;
    this.three = {
      containerId: null,
      scene: null,
      camera: null,
      renderer: null,
      mesh: null,
    };

    this._init();
  }

  _init() {
    this._initThreeScene();
    this._createSphereGeometry();
    this._updatedSpherePosition();
    this._loop();
    const center = Cesium.Cartesian3.fromDegrees(
      this.position[0],
      this.position[1]
    );
    const heading = Cesium.Math.toRadians(50.0);
    const pitch = Cesium.Math.toRadians(15);
    const range = 8000.0;
    this.viewer.camera.lookAt(
      center,
      new Cesium.HeadingPitchRange(heading, pitch, range)
    );
  }

  _createPanoramaContainer() {
    let container = document.createElement("div");
    document.body.appendChild(container);
    let time = new Date().getTime();
    container.id = "panorama-container-" + time;
    this.three.containerId = container.id;
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    return container;
  }

  _initThreeScene() {
    const { THREE } = this;
    let scene = new THREE.Scene();
    this.three.scene = scene;
    let fov = 45;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect = width / height;
    let near = 0.1;
    let far = 10 * 1000 * 1000;
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.three.camera = camera;
    let renderer = new THREE.WebGLRenderer({
      alpha: true,
    });
    this.three.renderer = renderer;
    let container = this._createPanoramaContainer();
    container.appendChild(renderer.domElement);
  }

  _createSphereGeometry() {
    const { THREE, panoramaUrl } = this;
    var texture = new THREE.TextureLoader().load(panoramaUrl);
    var material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });
    var sphereGeometry = new THREE.SphereGeometry(1, 50, 50);
    var sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.rotation.x = Math.PI / 2;
    //缩放控制大小
    sphere.scale.set(8000, 8000, 8000);
    let group = new THREE.Group();
    group.add(sphere);
    this.three.scene.add(group);
    this.three.mesh = group;
  }

  /**
   * cesium的世界坐标转three里的3维向量
   * @param {Cartesian3} cartesian3
   * @returns
   */
  _cartesian3ToVec(cartesian3) {
    const { THREE } = this;
    return new THREE.Vector3(cartesian3.x, cartesian3.y, cartesian3.z);
  }

  //将3DObject里的经纬度转换为threejs的世界坐标系,并赋给Mesh的position
  async _updatedSpherePosition() {
    const { THREE } = this;
    let lon = this.position[0];
    let lat = this.position[1];
    let height = this.position[2];
    if (!height) {
      let heightPoint = await Cesium.sampleTerrainMostDetailed(
        this.viewer.terrainProvider,
        Cesium.Cartesian3.fromDegrees(lon, lat, 0)
      );
      height = Cesium.Cartographic.fromCartesian(heightPoint).height;
    }

    let center = Cesium.Cartesian3.fromDegrees(lon, lat, height);
    let centerHigh = Cesium.Cartesian3.fromDegrees(lon, lat, height + 8000);

    var bottomLeft = this._cartesian3ToVec(
      Cesium.Cartesian3.fromDegrees(lon, lat, height)
    );
    var topLeft = this._cartesian3ToVec(
      Cesium.Cartesian3.fromDegrees(lon, lat + 0.01, height)
    );
    let latDir = new THREE.Vector3()
      .subVectors(bottomLeft, topLeft)
      .normalize();

    // 确定实体的位置和方向
    this.three.mesh.position.copy(this._cartesian3ToVec(center));
    this.three.mesh.lookAt(this._cartesian3ToVec(centerHigh));
    this.three.mesh.up.copy(latDir);
  }

  //cesium渲染
  _renderCesium() {
    this.viewer.render();
  }

  //three渲染,用cesium相机规则重新初始化three的相机,做到统一控制
  _renderThree() {
    const { viewer, three } = this;
    // 使用 Cesium 注册 Three.js 场景
    three.camera.fov = Cesium.Math.toDegrees(viewer.camera.frustum.fovy); // ThreeJS FOV是垂直的
    three.camera.updateProjectionMatrix();

    //同步两者的相机，由于用户直接的操作的是Cesium所以最终要求将ThreeJS的相机同步到Cesium上,
    //每一帧更新,所以这里要放到three的loop(animate)函数里
    three.camera.matrixAutoUpdate = false;
    let cvm = viewer.camera.viewMatrix;
    let civm = viewer.camera.inverseViewMatrix;
    three.camera.matrixWorld.set(
      civm[0],
      civm[4],
      civm[8],
      civm[12],
      civm[1],
      civm[5],
      civm[9],
      civm[13],
      civm[2],
      civm[6],
      civm[10],
      civm[14],
      civm[3],
      civm[7],
      civm[11],
      civm[15]
    );
    three.camera.matrixWorldInverse.set(
      cvm[0],
      cvm[4],
      cvm[8],
      cvm[12],
      cvm[1],
      cvm[5],
      cvm[9],
      cvm[13],
      cvm[2],
      cvm[6],
      cvm[10],
      cvm[14],
      cvm[3],
      cvm[7],
      cvm[11],
      cvm[15]
    );
    //three.camera.lookAt(new THREE.Vector3(0, 0, 0));
    let threeContainer = document.getElementById(this.three.containerId);
    let width = threeContainer.clientWidth;
    let height = threeContainer.clientHeight;
    let aspect = width / height;
    //透视摄像机 视锥体长宽比
    three.camera.aspect = aspect;
    three.camera.updateProjectionMatrix();

    three.renderer.setSize(width, height);
    three.renderer.render(three.scene, three.camera);
  }

  //在three的loop函数里,循环渲染cesium和three,同步两个渲染器
  _loop() {
    requestAnimationFrame(this._loop.bind(this));
    this._renderCesium();
    this._renderThree();
  }
}

export default Panorama;
