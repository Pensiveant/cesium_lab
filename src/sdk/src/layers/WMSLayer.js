import Layer from "./Layer.js";

class WMSLayer extends Layer {
  constructor(options) {
    super(options);
    options = this._setDefault(options);
    this.type = "wms";
    this.url = options.url;
    this.layers = options.layers;
    this.parameters = options.parameters;
    this._options = options;
    this._viewer = undefined;
    this._data = undefined;
    this.crs = options.crs;
  }

  _setDefault(options) {
    options = {
      crs: "CRS:84",
      srs: "EPSG:4326",
      ...options,
    };
    options.parameters = options?.parameters
      ? {
          ...Cesium.WebMapServiceImageryProvider.DefaultParameters,
          version: "1.3.0",
          ...options?.parameters,
        }
      : {
          ...Cesium.WebMapServiceImageryProvider.DefaultParameters,
          version: "1.3.0",
        };
    return options;
  }

  _addDataToViewer(viewer) {
    const wmsProvider = new Cesium.WebMapServiceImageryProvider({
      ...this._options,
    });
    const wmsLayer = new Cesium.ImageryLayer(wmsProvider);
    viewer.imageryLayers.add(wmsLayer);
    this._data = wmsLayer;
  }

  async _queryLayerExtent() {
    let resource = new Cesium.Resource({
      url: this._options.url,
      queryParameters: {
        request: "GetCapabilities",
        service: "WMS",
        version: this.parameters.version,
      },
    });
    const res = await resource.fetch();
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(res, "text/xml");
    // 查找layers对应的<Layer>节点
    const layers = this._options.layers.split(",");
    const layerNodes = [];
    let extent = {
      xmin: undefined,
      ymin: undefined,
      xmax: undefined,
      ymax: undefined,
    };
    for (let i = 0, len = layers.length; i < len; i++) {
      const nameDom = xmlDoc.evaluate(
        `//*[local-name()="Layer"]/*[local-name()="Name"][contains(., "${layers[i]}")]`,
        xmlDoc,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE
      );
      const len2 = nameDom.snapshotLength;
      for (let j = 0; j < len2; j++) {
        const layerNode = nameDom.snapshotItem(j).parentNode;
        layerNodes.push(layerNode);
        const boundingBoxDoms = layerNode.getElementsByTagName("BoundingBox");
        for (let k = 0, len3 = boundingBoxDoms.length; k < len3; k++) {
          const item = boundingBoxDoms[k];
          let crsName = item.getAttribute("SRS") ? "SRS" : "CRS";

          if (item.getAttribute(crsName) === this.crs) {
            let itemXmin;
            let itemXmax;
            let itemYmin;
            let itemYmax;
            if (
              this.parameters.version == "1.3.0" &&
              this.crs.includes("EPSG")
            ) {
              itemXmin = Number(item.getAttribute("miny"));
              itemXmax = Number(item.getAttribute("maxy"));
              itemYmin = Number(item.getAttribute("minx"));
              itemYmax = Number(item.getAttribute("maxx"));
            } else {
              itemXmin = Number(item.getAttribute("minx"));
              itemXmax = Number(item.getAttribute("maxx"));
              itemYmin = Number(item.getAttribute("miny"));
              itemYmax = Number(item.getAttribute("maxy"));
            }

            extent.xmin =
              !extent.xmin || itemXmin < extent.xmin ? itemXmin : extent.xmin;
            extent.xmax =
              !extent.xmax || itemXmax > extent.xmax ? itemXmax : extent.xmax;
            extent.ymin =
              !extent.ymin || itemYmin < extent.ymin ? itemYmin : extent.ymin;
            extent.ymax =
              !extent.ymax || itemYmax > extent.ymax ? itemYmax : extent.ymax;
          }
        }
      }
    }
    this.fullExtent = extent;
    return extent;
  }

  zoomTo() {
    const that = this;
    if (this.fullExtent) {
      const { xmin, ymin, xmax, ymax } = this.fullExtent;
      let rectangle = new Cesium.Rectangle(
        Cesium.Math.toRadians(xmin),
        Cesium.Math.toRadians(ymin),
        Cesium.Math.toRadians(xmax),
        Cesium.Math.toRadians(ymax)
      );
      that._viewer.camera.setView({
        destination: rectangle,
      });
    } else {
      this._queryLayerExtent().then((extent) => {
        const { xmin, ymin, xmax, ymax } = extent;
        let rectangle = new Cesium.Rectangle(
          Cesium.Math.toRadians(xmin),
          Cesium.Math.toRadians(ymin),
          Cesium.Math.toRadians(xmax),
          Cesium.Math.toRadians(ymax)
        );
        that._viewer.camera.setView({
          destination: rectangle,
        });
      });
    }
  }

  destroy() {
    this._viewer.imageryLayers.remove(this._data);
  }
}

export default WMSLayer;
