
// 注意需开启：viewer.scene.globe.depthTestAgainstTerrain = true;不然会跟着视口移动
class CircleScan {
  viewer;
  lastStageList;
  constructor(viewer) {
    this.viewer = viewer;
    this.lastStageList = [];
  }
  add(position, scanColor, maxRadius, duration) {
    this.lastStageList.push(
      this.showRadarScan(position, scanColor, maxRadius, duration)
    );
  }
  clear() {
    this.lastStageList.forEach((ele) => {
      this.clearScanEffects(ele);
    });
    this.lastStageList = [];
  }
  /**
   * 雷达扫描
   * @param {*} position  扫描中心 如[117.270739,31.84309,32]
   * @param {*} scanColor 扫描颜色 如"rgba(0,255,0,1)"
   * @param {*} maxRadius 扫描半径，单位米 如1000米
   * @param {*} duration 持续时间，单位毫秒 如4000
   */
  showRadarScan(position, scanColor, maxRadius, duration) {
    const cartographicCenter = new Cesium.Cartographic(
      Cesium.Math.toRadians(position[0]),
      Cesium.Math.toRadians(position[1]),
      position[2]
    );
    scanColor = new Cesium.Color.fromCssColorString(scanColor);
    const lastStage = this._addRadarScanPostStage(
      cartographicCenter,
      maxRadius,
      scanColor,
      duration
    );
    return lastStage;
  }
  /**
   *  添加雷达扫描线
   * @param {*} cartographicCenter  扫描中心
   * @param {*} maxRadius 扫描半径
   * @param {*} scanColor  扫描颜色
   * @param {*} duration  持续时间
   */
  _addRadarScanPostStage(cartographicCenter, radius, scanColor, duration) {
    const _Cartesian3Center =
      Cesium.Cartographic.toCartesian(cartographicCenter);
    const _Cartesian4Center = new Cesium.Cartesian4(
      _Cartesian3Center.x,
      _Cartesian3Center.y,
      _Cartesian3Center.z,
      1
    );

    const _CartographicCenter1 = new Cesium.Cartographic(
      cartographicCenter.longitude,
      cartographicCenter.latitude,
      cartographicCenter.height + 500
    );
    const _Cartesian3Center1 =
      Cesium.Cartographic.toCartesian(_CartographicCenter1);
    const _Cartesian4Center1 = new Cesium.Cartesian4(
      _Cartesian3Center1.x,
      _Cartesian3Center1.y,
      _Cartesian3Center1.z,
      1
    );

    const _CartographicCenter2 = new Cesium.Cartographic(
      cartographicCenter.longitude + Cesium.Math.toRadians(0.001),
      cartographicCenter.latitude,
      cartographicCenter.height
    );
    const _Cartesian3Center2 =
      Cesium.Cartographic.toCartesian(_CartographicCenter2);
    const _Cartesian4Center2 = new Cesium.Cartesian4(
      _Cartesian3Center2.x,
      _Cartesian3Center2.y,
      _Cartesian3Center2.z,
      1
    );
    const _RotateQ = new Cesium.Quaternion();
    const _RotateM = new Cesium.Matrix3();

    const _time = new Date().getTime();

    const _scratchCartesian4Center = new Cesium.Cartesian4();
    const _scratchCartesian4Center1 = new Cesium.Cartesian4();
    const _scratchCartesian4Center2 = new Cesium.Cartesian4();
    const _scratchCartesian3Normal = new Cesium.Cartesian3();
    const _scratchCartesian3Normal1 = new Cesium.Cartesian3();

    const _this = this;
    const ScanPostStage = new Cesium.PostProcessStage({
      fragmentShader: this._getRadarScanShader(),
      uniforms: {
        u_scanCenterEC: function () {
          return Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );
        },
        u_scanPlaneNormalEC: function () {
          const temp = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );
          const temp1 = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center1,
            _scratchCartesian4Center1
          );
          _scratchCartesian3Normal.x = temp1.x - temp.x;
          _scratchCartesian3Normal.y = temp1.y - temp.y;
          _scratchCartesian3Normal.z = temp1.z - temp.z;

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          );
          return _scratchCartesian3Normal;
        },
        u_radius: radius,
        u_scanLineNormalEC: function () {
          const temp = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center,
            _scratchCartesian4Center
          );
          const temp1 = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center1,
            _scratchCartesian4Center1
          );
          const temp2 = Cesium.Matrix4.multiplyByVector(
            _this.viewer.camera._viewMatrix,
            _Cartesian4Center2,
            _scratchCartesian4Center2
          );

          _scratchCartesian3Normal.x = temp1.x - temp.x;
          _scratchCartesian3Normal.y = temp1.y - temp.y;
          _scratchCartesian3Normal.z = temp1.z - temp.z;

          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal,
            _scratchCartesian3Normal
          );

          _scratchCartesian3Normal1.x = temp2.x - temp.x;
          _scratchCartesian3Normal1.y = temp2.y - temp.y;
          _scratchCartesian3Normal1.z = temp2.z - temp.z;

          const tempTime =
            ((new Date().getTime() - _time) % duration) / duration;
          Cesium.Quaternion.fromAxisAngle(
            _scratchCartesian3Normal,
            tempTime * Cesium.Math.PI * 2,
            _RotateQ
          );
          Cesium.Matrix3.fromQuaternion(_RotateQ, _RotateM);
          Cesium.Matrix3.multiplyByVector(
            _RotateM,
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          );
          Cesium.Cartesian3.normalize(
            _scratchCartesian3Normal1,
            _scratchCartesian3Normal1
          );
          return _scratchCartesian3Normal1;
        },
        u_scanColor: scanColor,
      },
    });
    this.viewer.scene.postProcessStages.add(ScanPostStage);

    return ScanPostStage;
  }
  /**
   * 雷达扫描线效果Shader
   */
  _getRadarScanShader() {
    const scanSegmentShader =
      `
        uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        in vec2 v_textureCoordinates;
        uniform vec4 u_scanCenterEC;
        uniform vec3 u_scanPlaneNormalEC;
        uniform vec3 u_scanLineNormalEC;
        uniform float u_radius;
        uniform vec4 u_scanColor;
        out vec4 outputColor;

        vec4 toEye(in vec2 uv,in float depth)
        {
            vec2 xy=vec2((uv.x*2.-1.),(uv.y*2.-1.));
            vec4 posInCamera=czm_inverseProjection*vec4(xy,depth,1.);
            posInCamera=posInCamera/posInCamera.w;
            return posInCamera;
        }

        bool isPointOnLineRight(in vec3 ptOnLine,in vec3 lineNormal,in vec3 testPt)
        {
            vec3 v01=testPt-ptOnLine;
            normalize(v01);
            vec3 temp=cross(v01,lineNormal);
            float d=dot(temp,u_scanPlaneNormalEC);
            return d>.5;
        }

        vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point)
        {
            vec3 v01=point-planeOrigin;
            float d=dot(planeNormal,v01);
            return(point-planeNormal*d);
        }

        float distancePointToLine(in vec3 ptOnLine,in vec3 lineNormal,in vec3 testPt)
        {
            vec3 tempPt=pointProjectOnPlane(lineNormal,ptOnLine,testPt);
            return length(tempPt-ptOnLine);
        }

        float getDepth(in vec4 depth)
        {
            float z_window=czm_unpackDepth(depth);
            z_window=czm_reverseLogDepth(z_window);
            float n_range=czm_depthRange.near;
            float f_range=czm_depthRange.far;
            return(2.*z_window-n_range-f_range)/(f_range-n_range);
        }

        void main()
        {
            outputColor=texture(colorTexture,v_textureCoordinates);
            float depth=getDepth(texture(depthTexture,v_textureCoordinates));
            vec4 viewPos=toEye(v_textureCoordinates,depth);
            vec3 prjOnPlane=pointProjectOnPlane(u_scanPlaneNormalEC.xyz,u_scanCenterEC.xyz,viewPos.xyz);
            float dis=length(prjOnPlane.xyz-u_scanCenterEC.xyz);
            float twou_radius=u_radius*2.;
            if(dis<u_radius)
            {
                float f0=1.-abs(u_radius-dis)/u_radius;
                f0=pow(f0,64.);
                vec3 lineEndPt=vec3(u_scanCenterEC.xyz)+u_scanLineNormalEC*u_radius;
                float f=0.;
                if(isPointOnLineRight(u_scanCenterEC.xyz,u_scanLineNormalEC.xyz,prjOnPlane.xyz))
                {
                    float dis1=length(prjOnPlane.xyz-lineEndPt);
                    f=abs(twou_radius-dis1)/twou_radius;
                    f=pow(f,3.);
                }
                outputColor=mix(outputColor,u_scanColor,f+f0);
            }
        }
      `;
    return scanSegmentShader;
  }
  /**
   * 清除特效对象
   * @param {*} lastStage 特效对象
   */
  clearScanEffects(lastStage) {
    this.viewer.scene.postProcessStages.remove(lastStage);
  }
}


export default CircleScan;