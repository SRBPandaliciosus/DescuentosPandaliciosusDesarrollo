function copyCode(code) {
    // Crea un elemento de texto temporal para copiar el código
    const tempInput = document.createElement('input');
    tempInput.value = code;
    document.body.appendChild(tempInput);
    
    // Selecciona el texto del input
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // Para dispositivos móviles

    // Copia el texto al portapapeles
    document.execCommand('copy');
    
    // Elimina el input temporal
    document.body.removeChild(tempInput);
    
    // Alerta o mensaje para el usuario
    alert("¡Código copiado! Usa el código " + code);
}

function updateVisitCount() {
    // Incrementa el contador de visitas en localStorage
    const visitCount = localStorage.getItem('visitCount') || 0;
    const newCount = parseInt(visitCount) + 1;
    localStorage.setItem('visitCount', newCount);

    // Muestra el contador en la página
    document.getElementById('visitCount').textContent = newCount;
}

// Actualiza el contador al cargar la página
document.addEventListener('DOMContentLoaded', updateVisitCount);

// Motor de búsqueda
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');

    if (query && window.location.pathname.endsWith('resultados.html')) {
        performSearch(query);
    }
});

function performSearch(query) {
	console.log('Buscando:', query);  // Asegúrate de que el query se está capturando
	// Convierte el término de búsqueda a minúsculas
    const lowerCaseQuery = query.toLowerCase();
    const pages = ['bancos.html', 'compras.html', 'redes_sociales.html', 'juegos.html'];
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<p>Buscando: <strong>${query}</strong></p>`;

    const resultsList = document.createElement('ul');
    let resultsFound = false;

    pages.forEach(page => {
        fetch(page)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Filtra los elementos para encontrar coincidencias ignorando mayúsculas y minúsculas
                const matches = Array.from(doc.body.querySelectorAll('*')).filter(el =>
                    el.textContent.toLowerCase().includes(lowerCaseQuery)  // Compara en minúsculas
                );

                if (matches.length > 0) {
                    resultsFound = true;
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `<a href="${page}" target="_blank">${page} (${matches.length} coincidencias)</a>`;
                    resultsList.appendChild(listItem);
                }
            })
            .catch(err => console.error(`Error buscando en ${page}:`, err))
            .finally(() => {
                if (!resultsFound) {
                    resultsContainer.innerHTML += '<p>No se encontraron resultados.</p>';
                }
                resultsContainer.appendChild(resultsList);
            });
    });
}