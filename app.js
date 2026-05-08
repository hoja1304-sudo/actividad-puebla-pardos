const CARTAGO_CENTER = { lat: 9.86444, lon: -83.91944 };

const references = [
  {
    id: "centro",
    name: "Centro histórico de Cartago",
    lat: 9.86444,
    lon: -83.91944,
    color: "#9f4f2e",
    description:
      "Referencia urbana para ubicar el núcleo histórico colonial de Cartago, antigua capital de Costa Rica."
  },
  {
    id: "basilica",
    name: "Basílica Nuestra Señora de los Ángeles",
    lat: 9.86405,
    lon: -83.91288,
    color: "#194f3b",
    description:
      "Santuario nacional situado en el sector de Los Ángeles. La tradición religiosa lo vincula con la devoción a la Virgen de los Ángeles."
  },
  {
    id: "caravaca",
    name: "Cruz de Caravaca",
    lat: 9.86836,
    lon: -83.91285,
    color: "#c99a3d",
    description:
      "Hito histórico asociado con límites sociales y espaciales de la ciudad colonial."
  },
  {
    id: "tribunales",
    name: "Tribunales de Justicia de Cartago",
    lat: 9.86375,
    lon: -83.91625,
    color: "#5b6f8c",
    description:
      "Referencia actual cercana al centro de Cartago, útil para orientar la lectura urbana contemporánea."
  },
  {
    id: "tec",
    name: "Instituto Tecnológico de Costa Rica",
    lat: 9.85579,
    lon: -83.91235,
    color: "#2d7c9f",
    description:
      "Campus central del TEC, referencia moderna al sur del sector de Los Angeles."
  },
  {
    id: "toyogres",
    name: "Rio Toyogres",
    lat: 9.83551,
    lon: -83.90405,
    color: "#257ea6",
    description:
      "Curso de agua al sureste de Cartago. Se incluye como referencia territorial del paisaje oriental."
  }
];

const approximateZone = [
  [-83.9144, 9.8688],
  [-83.9092, 9.8681],
  [-83.9077, 9.8627],
  [-83.9105, 9.8584],
  [-83.9150, 9.8600],
  [-83.9160, 9.8650]
];

const scenes = [
  {
    title: "Centro histórico de Cartago",
    lat: 9.86444,
    lon: -83.91944,
    height: 1850,
    heading: 85,
    pitch: -43,
    text: "Punto de partida para leer la ciudad colonial y sus bordes sociales."
  },
  {
    title: "Basílica de Los Ángeles",
    lat: 9.86405,
    lon: -83.91288,
    height: 1200,
    heading: 25,
    pitch: -48,
    text: "Referencia central del sector de Los Ángeles y de la tradición religiosa cartaginesa."
  },
  {
    title: "Cruz de Caravaca",
    lat: 9.86836,
    lon: -83.91285,
    height: 1050,
    heading: 170,
    pitch: -50,
    text: "Hito para discutir segregación, límites urbanos y memoria colonial."
  },
  {
    title: "Río Toyogres",
    lat: 9.83551,
    lon: -83.90405,
    height: 2300,
    heading: 340,
    pitch: -42,
    text: "Referencia geográfica del paisaje oriental y sureste de Cartago."
  },
  {
    title: "Zona aproximada de la Puebla de los Pardos",
    lat: 9.8641,
    lon: -83.9120,
    height: 1450,
    heading: 30,
    pitch: -55,
    text: "Polígono interpretativo, no coordenada exacta confirmada."
  }
];

let viewer;
let zoneEntity;
let routeEntity;
let tourRunning = false;

function initMap() {
  Cesium.Ion.defaultAccessToken = "";

  viewer = new Cesium.Viewer("cesiumContainer", {
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: true,
    sceneModePicker: false,
    selectionIndicator: true,
    timeline: false,
    navigationHelpButton: false,
    imageryProvider: new Cesium.OpenStreetMapImageryProvider({
      url: "https://tile.openstreetmap.org/"
    }),
    terrainProvider: new Cesium.EllipsoidTerrainProvider()
  });

  viewer.scene.globe.enableLighting = true;
  viewer.scene.skyAtmosphere.show = true;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 250;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000;

  addMarkers();
  addApproximateZone();
  addNarrativeRoute();
  bindControls();
  flyToInitialView();
}

function addMarkers() {
  references.forEach((place) => {
    viewer.entities.add({
      id: place.id,
      name: place.name,
      position: Cesium.Cartesian3.fromDegrees(place.lon, place.lat, 40),
      point: {
        pixelSize: 13,
        color: Cesium.Color.fromCssColorString(place.color),
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 3,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
      },
      label: {
        text: place.name,
        font: "700 15px Inter, sans-serif",
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 4,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new Cesium.Cartesian2(0, -32),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 8000)
      },
      description: `
        <p>${place.description}</p>
        <p><strong>Nota:</strong> coordenada actual aproximada usada solo como referencia educativa.</p>
      `
    });
  });
}

function addApproximateZone() {
  zoneEntity = viewer.entities.add({
    id: "zona-aproximada",
    name: "Zona aproximada de la Puebla de los Pardos",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray(approximateZone.flat()),
      material: Cesium.Color.fromCssColorString("#9f4f2e").withAlpha(0.38),
      outline: true,
      outlineColor: Cesium.Color.fromCssColorString("#5d2b1a"),
      height: 18
    },
    description: `
      <p><strong>Esta zona es interpretativa.</strong></p>
      <p>No representa una coordenada histórica exacta confirmada. Su función es relacionar fuentes históricas generales con referencias actuales del sector oriental de Cartago.</p>
    `
  });

  viewer.entities.add({
    id: "zona-aproximada-etiqueta",
    name: "Etiqueta de zona aproximada",
    position: Cesium.Cartesian3.fromDegrees(-83.9121, 9.8642, 95),
    label: {
      text: "Zona aproximada de la Puebla de los Pardos",
      font: "800 17px Inter, sans-serif",
      fillColor: Cesium.Color.WHITE,
      outlineColor: Cesium.Color.fromCssColorString("#4a2417"),
      outlineWidth: 5,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -10)
    }
  });
}

function addNarrativeRoute() {
  const routePositions = scenes.map((scene) =>
    Cesium.Cartesian3.fromDegrees(scene.lon, scene.lat, 65)
  );

  routeEntity = viewer.entities.add({
    id: "recorrido-narrativo",
    name: "Ruta narrativa",
    polyline: {
      positions: routePositions,
      width: 4,
      material: new Cesium.PolylineDashMaterialProperty({
        color: Cesium.Color.fromCssColorString("#194f3b"),
        dashLength: 18
      }),
      clampToGround: false
    }
  });
}

function bindControls() {
  document.getElementById("tourButton").addEventListener("click", runTour);
  document.getElementById("showZoneButton").addEventListener("click", () => setZoneVisible(true));
  document.getElementById("hideZoneButton").addEventListener("click", () => setZoneVisible(false));
  document.getElementById("resetButton").addEventListener("click", flyToInitialView);

  document.querySelectorAll("#sceneList li").forEach((item) => {
    item.addEventListener("click", () => flyToScene(Number(item.dataset.scene)));
  });
}

function setZoneVisible(visible) {
  zoneEntity.show = visible;
  const label = viewer.entities.getById("zona-aproximada-etiqueta");
  if (label) label.show = visible;
  updateStatus(visible ? "Zona aproximada visible" : "Zona aproximada oculta");
}

function flyToInitialView() {
  updateActiveScene();
  updateStatus("Vista inicial");
  setZoneVisible(true);
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(CARTAGO_CENTER.lon, CARTAGO_CENTER.lat, 5200),
    orientation: {
      heading: Cesium.Math.toRadians(70),
      pitch: Cesium.Math.toRadians(-50),
      roll: 0
    },
    duration: 1.5
  });
}

function flyToScene(index) {
  const scene = scenes[index];
  updateActiveScene(index);
  updateStatus(scene.title);

  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(scene.lon, scene.lat, scene.height),
    orientation: {
      heading: Cesium.Math.toRadians(scene.heading),
      pitch: Cesium.Math.toRadians(scene.pitch),
      roll: 0
    },
    duration: 2.2
  });
}

async function runTour() {
  if (tourRunning) return;
  tourRunning = true;
  setZoneVisible(true);

  for (let i = 0; i < scenes.length; i += 1) {
    flyToScene(i);
    await wait(3600);
  }

  tourRunning = false;
}

function updateStatus(text) {
  document.getElementById("sceneStatus").textContent = text;
}

function updateActiveScene(index) {
  document.querySelectorAll("#sceneList li").forEach((item) => {
    item.classList.toggle("active", Number(item.dataset.scene) === index);
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

window.addEventListener("DOMContentLoaded", initMap);
