// Selección de elementos
const mapFrame = document.getElementById('map-frame');
const layerButtons = document.querySelectorAll('.btn-layer');

// URLs de visores en Tarija con vientos configurados en km/h
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
        
        if (mapUrls[layerType] && mapFrame) {
            // Activar botón visualmente
            layerButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Cargar capa en el visor central
            mapFrame.src = mapUrls[layerType];
        }
    });
});
