// Selección de elementos
const mapFrame = document.getElementById('map-frame');
const layerButtons = document.querySelectorAll('.btn-layer');

// URLs directas de todos los visores centrados en Tarija
const mapUrls = {
    'dndvi': 'https://www.openstreetmap.org/export/embed.html?bbox=-65.50%2C-22.10%2C-63.50%2C-21.00&amp;layer=mapnik',
    'windy-viento': 'https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=-21.53&lon=-64.73',
    'windy-fuego': 'https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=9&overlay=fires&product=ecmwf&level=surface&lat=-21.53&lon=-64.73',
    'copernicus': 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=-21.53&lng=-64.73'
};

// Asignar el evento clic a cada botón
layerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const layerType = button.getAttribute('data-layer');
        
        // Si el botón tiene una URL asignada en nuestro objeto mapUrls
        if (mapUrls[layerType] && mapFrame) {
            // Cambiar clase activa a los botones
            layerButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Cambiar la vista del iframe central sin salir de la página
            mapFrame.src = mapUrls[layerType];
        }
    });
});
