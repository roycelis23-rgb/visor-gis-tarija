// Selección de elementos
const mapFrame = document.getElementById('map-frame');
const leafletContainer = document.getElementById('leaflet-map');
const layerButtons = document.querySelectorAll('.btn-layer');
const panelGps = document.getElementById('panel-gps');

// URLs de visores
const mapUrls = {
    'dndvi': 'https://www.openstreetmap.org/export/embed.html?bbox=-65.50%2C-22.10%2C-63.50%2C-21.00&amp;layer=mapnik',
    'windy-viento': 'https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=%C2%B0C&metricWind=km%2Fh&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=-21.53&lon=-64.73',
    'windy-fuego': 'https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=%C2%B0C&metricWind=km%2Fh&zoom=9&overlay=temp&product=ecmwf&level=surface&lat=-21.53&lon=-64.73',
    'copernicus': 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=-21.53&lng=-64.73'
};

// Conmutación de mapas
layerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const layerType = button.getAttribute('data-layer');
        
        layerButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        if (layerType === 'leaflet-draw') {
            // Mostrar visor Leaflet interactivo para dibujar/GPS
            mapFrame.style.display = 'none';
            leafletContainer.style.display = 'block';
            panelGps.style.display = 'block';
            initLeafletMap();
        } else {
            // Mostrar visores incrustados (Windy/OSM/Copernicus)
            leafletContainer.style.display = 'none';
            panelGps.style.display = 'none';
            mapFrame.style.display = 'block';
            if (mapUrls[layerType]) {
                mapFrame.src = mapUrls[layerType];
            }
        }
    });
});

// Inicialización de Leaflet (solo al presionar el botón)
let lMap = null;
let drawnItems = null;

function initLeafletMap() {
    if (lMap !== null) {
        lMap.invalidateSize();
        return;
    }

    lMap = L.map('leaflet-map').setView([-21.53, -64.73], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(lMap);

    drawnItems = new L.FeatureGroup();
    lMap.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
        edit: { featureGroup: drawnItems },
        draw: { polygon: true, polyline: true, marker: true, circle: false, rectangle: true }
    });
    lMap.addControl(drawControl);

    lMap.on(L.Draw.Event.CREATED, function (event) {
        const layer = event.layer;
        drawnItems.addLayer(layer);
        if (layer instanceof L.Polygon) {
            const latlngs = layer.getLatLngs()[0];
            let areaM2 = L.GeometryUtil ? L.GeometryUtil.geodesicArea(latlngs) : 0;
            const areaHa = (areaM2 / 10000).toFixed(2);
            layer.bindPopup(`<b>Superficie:</b> ${areaHa} ha`).openPopup();
        }
    });
}

// Track GPS y Geolocalización
let watchId = null;
let trackCoords = [];
let trackPolyline = null;

document.getElementById('btn-location').addEventListener('click', () => {
    if (lMap) lMap.locate({ setView: true, maxZoom: 15 });
});

document.getElementById('btn-track-start').addEventListener('click', () => {
    if (!navigator.geolocation) return alert("GPS no disponible.");
    trackCoords = [];
    if (trackPolyline && lMap) lMap.removeLayer(trackPolyline);
    trackPolyline = L.polyline([], { color: 'red', weight: 4 }).addTo(lMap);
    
    document.getElementById('btn-track-start').disabled = true;
    document.getElementById('btn-track-stop').disabled = false;

    watchId = navigator.geolocation.watchPosition((pos) => {
        const point = [pos.coords.latitude, pos.coords.longitude];
        trackCoords.push(point);
        trackPolyline.setLatLngs(trackCoords);
        lMap.panTo(point);
    }, (err) => console.error(err), { enableHighAccuracy: true });
});

document.getElementById('btn-track-stop').addEventListener('click', () => {
    if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    document.getElementById('btn-track-start').disabled = false;
    document.getElementById('btn-track-stop').disabled = true;
    if (drawnItems && trackPolyline) drawnItems.addLayer(trackPolyline);
    alert("Track GPS guardado.");
});

document.getElementById('btn-export').addEventListener('click', () => {
    if (!drawnItems) return;
    const data = drawnItems.toGeoJSON();
    if (data.features.length === 0) return alert("No hay datos cargados.");
    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const a = document.createElement('a');
    a.href = jsonString;
    a.download = `monitoreo_tarija_${Date.now()}.geojson`;
    a.click();
});
