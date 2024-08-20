class CustomGeographicTilingScheme {
  constructor(options) {}

  // 获取wmts的元数据
  async #getServiceXmlData(url) {
    let resource = new Cesium.Resource({
      url,
      queryParameters: {
        request: "GetCapabilities",
        service: "WMTS",
        version: "1.0.0",
      },
    });
    let xmlData = await resource.fetch();
    return xmlData;
  }

  #getParamsFromCapabilitiesXml(xmlData) {
    let params = {};
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlData, "text/html");
    
    // 1.从图层获取参数
    let layerArray = xmlDoc.documentElement.getElementsByTagName("Layer");
    layerArray = [...layerArray];
    let layer = layerArray.find((item) => {
      let identifier =
        item.getElementsByTagName("ows:Identifier")[0].textContent;
      if (identifier === this.agMetaData.layerTable) {
        return true;
      }
    });

    // 获取style
    params.style = "";
    let styleName = layer
      .getElementsByTagName("Style")[0]
      .firstChild.data.match(/<ows:Identifier>.*</);
    if (styleName?.length) {
      params.style = styleName[0].slice(16, -1);
    }

    // 获取rectangle
    let boundingBox = layer.getElementsByTagName("ows:WGS84BoundingBox")[0];
    if (!boundingBox) {
      boundingBox = layer.getElementsByTagName("ows:BoundingBox")[0];
    }
    if (boundingBox) {
      let lowerCorner =
        boundingBox.getElementsByTagName("ows:LowerCorner")[0].textContent;
      let upperCorner =
        boundingBox.getElementsByTagName("ows:UpperCorner")[0].textContent;
      lowerCorner = lowerCorner.split(" ");
      upperCorner = upperCorner.split(" ");
      params.rectangle = Cesium.Rectangle.fromDegrees(
        parseFloat(lowerCorner[0]),
        parseFloat(lowerCorner[1]),
        parseFloat(upperCorner[0]),
        parseFloat(upperCorner[1])
      );
    }

    // 获取format
    let formatArray = layer.getElementsByTagName("Format");
    if (formatArray.length > 0) {
      params.format = formatArray[0].textContent;
    }

    // 2.从矩阵级获取参数
    let tileMatrixSetArray =
      xmlDoc.documentElement.getElementsByTagName("TileMatrixSet");
    tileMatrixSetArray = [...tileMatrixSetArray];
    let tileMatrixSet = tileMatrixSetArray.find((item) => {
      let identifier = item.getElementsByTagName("ows:Identifier");
      if (
        identifier.length &&
        identifier[0].textContent === this.agMetaData.tileMatrixSet
      ) {
        return true;
      }
    });

    let tileOrigin = undefined;
    let lod0Resolution = undefined;
    let lod0ScaleDenominator = undefined;
    let tileInfo = {
      lods: [],
    };
    let tileMatrixArray = tileMatrixSet.getElementsByTagName("TileMatrix");

    // 获取tileWidth、tileHeight
    let tileMatrix0 = tileMatrixArray[0];
    params.tileWidth = parseInt(
      tileMatrix0.getElementsByTagName("TileWidth")[0].textContent
    );
    params.tileHeight = parseInt(
      tileMatrix0.getElementsByTagName("TileHeight")[0].textContent
    );
    tileInfo.rows = params.tileHeight;
    tileInfo.cols = params.tileWidth;
    lod0ScaleDenominator = parseFloat(
      tileMatrix0.getElementsByTagName("ScaleDenominator")[0].textContent
    );

    let topLeftCorner =
      tileMatrix0.getElementsByTagName("TopLeftCorner")[0].textContent;
    topLeftCorner = topLeftCorner.split(" ");
    tileOrigin = {
      x: parseFloat(topLeftCorner[1]),
      y: parseFloat(topLeftCorner[0]),
    };

    if (tileOrigin.x === 90 && tileOrigin.y === -180) {
      tileOrigin.x = -180;
      tileOrigin.y = 90;
    }
    if (tileOrigin.x === 20037508.34 && tileOrigin.y === -20037508.34) {
      tileOrigin.x = -20037508.34;
      tileOrigin.y = 20037508.34;
    }

    let tileMatrixLabels = [];
    for (let ii = 0; ii < tileMatrixArray.length; ii++) {
      const tileMatrix = tileMatrixArray[ii];
      let identifier =
        tileMatrix.getElementsByTagName("ows:Identifier")[0].textContent;
      let splitArr = identifier.split(":");
      tileInfo.lods.push({
        level: parseInt(splitArr[splitArr.length - 1]),
        scale: parseFloat(
          tileMatrix.getElementsByTagName("ScaleDenominator")[0].textContent
        ),
      });
      tileMatrixLabels.push(identifier);
    }
    // 获取tileMatrixLabels
    params.tileMatrixLabels = tileMatrixLabels;

    // 有传入，优先用传入的
    if (Cesium.defined(this.agMetaData.tileInfo)) {
      tileInfo = this.agMetaData.tileInfo;
    }

    // 获取minimumLevel、maximumLevel
    if (tileInfo.lods.length > 0) {
      params.minimumLevel = tileInfo.lods[0].level;
      params.maximumLevel = tileInfo.lods[tileInfo.lods.length - 1].level;
    }

    if (Cesium.defined(this.agMetaData.tile0Resolution)) {
      lod0Resolution = this.agMetaData.tile0Resolution;
      lod0ScaleDenominator = undefined;
    }
    if (
      Cesium.defined(this.agMetaData.tileOriginX) &&
      Cesium.defined(this.agMetaData.tileOriginY)
    ) {
      tileOrigin = {
        x: this.agMetaData.tileOriginX,
        y: this.agMetaData.tileOriginY,
      };
    }
    if (Cesium.defined(this.agMetaData.tileWidth)) {
      params.tileWidth = this.agMetaData.tileWidth;
    }
    if (Cesium.defined(this.agMetaData.tileHeight)) {
      params.tileHeight = this.agMetaData.tileHeight;
    }

    // 获取tilingScheme
    let spatialReference = new SpatialReference(
      this.agMetaData.spatialReference
    );
    let tilingSchemeInfo = {
      tileOrigin: tileOrigin,
      lod0Resolution: lod0Resolution,
      lod0ScaleDenominator: lod0ScaleDenominator,
      tileWidth: params.tileWidth,
      tileHeight: params.tileHeight,
      dpi: this.agMetaData.dpi,
      metersPerDegree: this.agMetaData.metersPerDegree,
      metersPerInch: this.agMetaData.metersPerInch,
      tileInfo: tileInfo,
      tilingSchemeRectangle: this.agMetaData.tilingSchemeRectangle,
    };
    params.tilingScheme = tilingSchemeCreator.create(
      tilingSchemeInfo,
      spatialReference
    );
    return params;
  }
}
