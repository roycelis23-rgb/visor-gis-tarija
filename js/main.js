// 1. Inicializar el Mapa centrado en Tarija (-21.53, -64.73)
const map = L.map('map').setView([-21.53, -64.73], 10);

// Capas Base
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

const esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
});

// Control de Capas Base
const baseMaps = {
    "Mapa Callejero (OSM)": osmLayer,
    "Imagen Satelital (Esri)": esriSatLayer
};
L.control.layers(baseMaps).addTo(map);

// 2. Capa para Dibujos y Digitalización
const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

// Control de Dibujo (Puntos, Líneas, Polígonos)
const drawControl = new L.Control.Draw({
    edit: {
        featureGroup: drawnItems,
        remove: true
    },
    draw: {
        polygon: {
            allowIntersection: false,
            showArea: true
        },
        polyline: true,
        marker: true,
        circle: false,
        circlemarker: false,
        rectangle: true
    }
});
map.addControl(drawControl);

// Evento al terminar de dibujar una figura
map.on(L.Draw.Event.CREATED, function (event) {
    const layer = event.layer;
    drawnItems.addLayer(layer);

    // Si es un polígono, calcular área en hectáreas
    if (layer instanceof L.Polygon) {
        const latlngs = layer.getLatLngs()[0];
        let areaM2 = 0;
        
        // Cálculo aproximado de área
        if (L.GeometryUtil) {
            areaM2 = L.GeometryUtil.geodesicArea(latlngs);
        }
        
        const areaHa = (areaM2 / 10000).toFixed(2);
        layer.bindPopup(`<b>Superficie Estimada:</b> ${areaHa} ha`).openPopup();
    }
});

// 3. Geolocalización y Rastreo (Track GPS)
let watchId = null;
let trackCoords = [];
let trackPolyline = L.polyline([], { color: 'red', weight: 4 }).addTo(map);
let userMarker = null;

// Ubicación actual puntual
document.getElementById('btn-location').addEventListener('click', () => {
    map.locate({ setView: true, maxZoom: 15 });
});

map.on('locationfound', (e) => {
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.marker(e.latlng).addTo(map)
        .bindPopup("Estás aquí").openPopup();
});

map.on('locationerror', () => {
    alert("No se pudo acceder al GPS del dispositivo.");
});

// Iniciar Rastreo de Track GPS
document.getElementById('btn-track-start').addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("Tu navegador no soporta geolocalización.");
        return;
    }

    trackCoords = [];
    trackPolyline.setLatLngs([]);
    document.getElementById('btn-track-start').disabled = true;
    document.getElementById('btn-track-stop').disabled = false;

    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const newPoint = [lat, lng];

            trackCoords.push(newPoint);
            trackPolyline.setLatLngs(trackCoords);
            map.panTo(newPoint);
        },
        (error) => console.error("Error en GPS:", error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
});

// Detener Rastreo de Track GPS
document.getElementById('btn-track-stop').addEventListener('click', () => {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }

    document.getElementById('btn-track-start').disabled = false;
    document.getElementById('btn-track-stop').disabled = true;

    if (trackCoords.length > 0) {
        // Convertir la línea grabada a elemento guardable
        const lineLayer = L.polyline(trackCoords, { color: 'red' });
        drawnItems.addLayer(lineLayer);
        alert("Track GPS guardado en la lista de elementos.");
    }
});

// 4. Exportar Todo a GeoJSON
document.getElementById('btn-export').addEventListener('click', () => {
    const data = drawnItems.toGeoJSON();
    if (data.features.length === 0) {
        alert("No hay ningún punto, polígono o track registrado para exportar.");
        return;
    }

    const jsonString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `monitoreo_tarija_${Date.now()}.geojson`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
});
