// Selección de elementos
const mapFrame = document.getElementById('map-frame');
const layerButtons = document.querySelectorAll('.btn-layer');

// URLs integradas para Tarija (Coordenadas centradas approx: -21.53, -64.73)
const mapUrls = {
    'dndvi': 'https://www.openstreetmap.org/export/embed.html?bbox=-65.50%2C-22.10%2C-63.50%2C-21.00&amp;layer=mapnik',
    'windy-viento': 'https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=9&overlay=wind&product=ecmwf&level=surface&lat=-21.53&lon=-64.73',
    'windy-fuego': 'https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=default&zoom=9&overlay=fires&product=ecmwf&level=surface&lat=-21.53&lon=-64.73',
    'copernicus': 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=-21.53&lng=-64.73'
};

layerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const layerType = button.getAttribute('data-layer');
        
        // Capas que se cargan directo dentro del visor central
        if (layerType === 'dndvi' || layerType === 'windy-viento' || layerType === 'windy-fuego') {
            layerButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            if (mapFrame && mapUrls[layerType]) {
                mapFrame.src = mapUrls[layerType];
            }
        } 
        // Copernicus se abre en nueva pestaña para permitir login y evitar bloqueos de sesión
        else if (layerType === 'copernicus') {
            window.open(mapUrls['copernicus'], '_blank');
        }
    });
});
