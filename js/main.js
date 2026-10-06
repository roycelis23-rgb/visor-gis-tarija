// Selección de elementos
const mapFrame = document.getElementById('map-frame');
const layerButtons = document.querySelectorAll('.btn-layer');

// URLs del mapa base y portales externos
const mapUrls = {
    'dndvi': 'https://www.openstreetmap.org/export/embed.html?bbox=-65.50%2C-22.10%2C-63.50%2C-21.00&amp;layer=mapnik',
    'firms': 'https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;td:24hrs;col:firms-shape;@-64.73,-21.53,9.5z',
    'copernicus': 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=-21.53&lng=-64.73'
};

layerButtons.forEach(button => {
    button.addEventListener('click', () => {
        const layerType = button.getAttribute('data-layer');
        
        if (layerType === 'dndvi') {
            // Activar visualmente
            layerButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Cargar mapa de Tarija en el visor central
            mapFrame.src = mapUrls['dndvi'];
        } else if (layerType === 'firms' || layerType === 'copernicus') {
            // Para evitar errores de bloqueo (X-Frame-Options), abrimos en pestaña nueva
            window.open(mapUrls[layerType], '_blank');
        }
    });
});
