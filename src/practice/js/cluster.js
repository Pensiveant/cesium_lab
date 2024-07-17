// const Cesium = require("cesium"); // 智能提示使用
import { modifyMap } from "./tools.js";
import { data } from "../data/points.js";

import createViewer from "../../demo/js/initViewer.js";
const viewer = createViewer({
  showTerrain: false,
});

var options = {
  style: "elec", // style: img、elec、cva
  crs: "WGS84", // 使用84坐标系，默认为：GCJ02
};
viewer.imageryLayers.add(
  new Cesium.ImageryLayer(new AmapImageryProvider(options))
);
viewer.cesiumWidget.creditContainer.style.display = "none"; // 去除logo
window.viewer = viewer;
modifyMap(viewer, {
  //反色?
  invertColor: true,
  //滤镜值
  filterRGB: [60, 145, 172],
});
loadArea(viewer);
loadPointsLayer(viewer);

async function loadArea(viewer) {
  try {
    let res = await Cesium.Resource.fetchJson({
      url: "./data/金堂县.json",
      queryParameters: {
        outputFormat: "application/json",
      },
    });

    // 加载Geojson: 面
    Cesium.GeoJsonDataSource.load(res, {
      stroke: Cesium.Color.RED,
      strokeWidth: 5,
      fill: Cesium.Color.RED.withAlpha(0),
    }).then((polygonGeojson) => {
      viewer.dataSources.add(polygonGeojson);
      viewer.flyTo(polygonGeojson); // 定位
    });

    const { coordinates } = res.features[0].geometry;
    const points = coordinates[0][0];
    const positions = [];
    for (let i = 1; i < points.length; i++) {
      const item = points[i];
      positions.push(item[0]);
      positions.push(item[1]);
    }
  } catch (error) {
    throw new Error("加载json失败");
  }
}

function loadPointsLayer(viewer) {
  const dataSource = new Cesium.CustomDataSource("兴趣点");
  dataSource.clustering.enabled = true;
  dataSource.clustering.pixelRange = 15;
  dataSource.clustering.minimumClusterSize = 3;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const { coordinate } = item;
    if (!coordinate) {
      continue;
    }
    const positon = coordinate.split(",");
    const entity = dataSource.entities.add({
      position: Cesium.Cartesian3.fromDegrees(positon[0], positon[1], 0),
      billboard: {
        image: "./img/fire.png",
        width: 48,
        height: 48,
      },
    });
  }

  viewer.dataSources.add(dataSource);
  window.removeListener = undefined;
  if (Cesium.defined(removeListener)) {
    removeListener();
    removeListener = undefined;
  } else {
    const pinBuilder = new Cesium.PinBuilder();
    const pin50 = pinBuilder.fromText("50+", Cesium.Color.RED, 48).toDataURL();
    const pin40 = pinBuilder
      .fromText("40+", Cesium.Color.ORANGE, 48)
      .toDataURL();
    const pin30 = pinBuilder
      .fromText("30+", Cesium.Color.YELLOW, 48)
      .toDataURL();
    const pin20 = pinBuilder
      .fromText("20+", Cesium.Color.GREEN, 48)
      .toDataURL();
    const pin10 = pinBuilder.fromText("10+", Cesium.Color.BLUE, 48).toDataURL();
    const singleDigitPins = new Array(8);
    for (let i = 0; i < singleDigitPins.length; ++i) {
      singleDigitPins[i] = pinBuilder
        .fromText(`${i + 2}`, Cesium.Color.VIOLET, 48)
        .toDataURL();
    }
    
    window.removeListener = dataSource.clustering.clusterEvent.addEventListener(
      function (clusteredEntities, cluster) {
        cluster.label.show = false;
        cluster.billboard.show = true;
        cluster.billboard.id = cluster.label.id;
        cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

        if (clusteredEntities.length >= 50) {
          cluster.billboard.image = pin50;
        } else if (clusteredEntities.length >= 40) {
          cluster.billboard.image = pin40;
        } else if (clusteredEntities.length >= 30) {
          cluster.billboard.image = pin30;
        } else if (clusteredEntities.length >= 20) {
          cluster.billboard.image = pin20;
        } else if (clusteredEntities.length >= 10) {
          cluster.billboard.image = pin10;
        } else {
          cluster.billboard.image =
            singleDigitPins[clusteredEntities.length - 2];
        }
      }
    );
  }
}
