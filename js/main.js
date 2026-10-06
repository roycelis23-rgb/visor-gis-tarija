// Selección de elementos del DOM
const mapFrame = document.getElementById('map-frame');
const layerButtons = document.querySelectorAll('.btn-layer');

// Rutas/Enlaces para cada capa
const mapUrls = {
    'dndvi': 'https://www.openstreetmap.org/export/embed.html?bbox=-65.10%2C-21.80%2C-64.30%2C-21.20&amp;layer=mapnik',
    'firms': 'https://firms.modaps.eosdis.nasa.gov/map/#d:24hrs;td:24hrs;col:firms-shape;@-64.73,-21.53,9.5z',
    'copernicus': 'https://browser.dataspace.copernicus.eu/?zoom=10&lat=-21.53&lng=-64.73'
};

// Evento para cambiar de capa al hacer clic en los botones
layerButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Quitar la clase activa de todos los botones
        layerButtons.forEach(btn => btn.classList.remove('active'));
        
        // Activar el botón presionado
        button.classList.add('active');
        
        // Cambiar la fuente del iframe
        const layerType = button.getAttribute('data-layer');
        if (mapUrls[layerType] && mapFrame) {
            mapFrame.src = mapUrls[layerType];
        }
    });
});
