const subDomains = ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"];
export function getTiandituImgLayer() {
  const urlTemplate =
    "http://{s}.tianditu.com/img_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=img&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=bc583fc978a02e283d437b781f314b51";
  var imgMap = new Cesium.WebMapTileServiceImageryProvider({
    url: urlTemplate,
    subdomains: subDomains,
    tileMatrixSetID: "EPSG::900913",
    tilingScheme: new Cesium.GeographicTilingScheme(),
    maximumLevel: 18,
    tileMatrixLabels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"]
  });
  return imgMap;
}

export function getTiandituImgMarkLayer() {
  const urlTemplate =
  'http://{s}.tianditu.com/cia_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=cia&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=bc583fc978a02e283d437b781f314b51';
  var imgMap = new Cesium.WebMapTileServiceImageryProvider({
    url: urlTemplate,
    subdomains: subDomains,
    tileMatrixSetID: "EPSG::900913",
    tilingScheme: new Cesium.GeographicTilingScheme(),
    maximumLevel: 18,
    tileMatrixLabels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"]

  });
  return imgMap;
}



export function getTiandituVecLayer() {
  const urlTemplate =
    "http://{s}.tianditu.com/vec_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=vec&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=bc583fc978a02e283d437b781f314b51";
  var vecMap = new Cesium.WebMapTileServiceImageryProvider({
    url: urlTemplate,
    subdomains: subDomains,
    tileMatrixSetID: "EPSG::4490",
    tilingScheme: new Cesium.GeographicTilingScheme(),
    maximumLevel: 17,
    tileMatrixLabels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"]

  });
  return vecMap;
}

export function getTiandituVecMarkLayer() {
  const urlTemplate =
  'http://{s}.tianditu.com/cva_c/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=cva&STYLE=default&FORMAT=tiles&TILEMATRIXSET=c&TILEMATRIX={TileMatrix}&TILEROW={TileRow}&TILECOL={TileCol}&tk=bc583fc978a02e283d437b781f314b51';
  var vecMap = new Cesium.WebMapTileServiceImageryProvider({
    url: urlTemplate,
    subdomains: subDomains,
    tileMatrixSetID: "EPSG::4490",
    tilingScheme: new Cesium.GeographicTilingScheme(),
    maximumLevel: 17,
    tileMatrixLabels:["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18"]
  });
  return vecMap;
}
