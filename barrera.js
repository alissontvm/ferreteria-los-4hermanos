document.addEventListener("DOMContentLoaded", function () {
    const header = document.querySelector('header');
    
    if (header) {
        header.innerHTML = `
        <nav class="navbar">
            <div class="logo-area">
                <img src="ferreteria4h.png" alt="Logo Ferretería Los 4H" class="logo">
                <span class="brand-name">FERRETERÍA LOS 4H</span>
            </div>

            <div class="nav-links">
                <a href="index.html">Inicio</a>
                <a href="nosotros.html">Nosotros</a>
                <a href="contacto.html">Contacto</a>
            </div>

            <div class="search-box">
                <input type="text" id="buscador-global" placeholder="Buscar productos...">
                <button><i class="fas fa-search"></i></button>
            </div>
        </nav>`;
        
        // Llamamos a la función del buscador después de crear el HTML
        iniciarBuscador();
    }
});

function iniciarBuscador() {
    const input = document.getElementById('buscador-global');
    if (!input) return;

    input.addEventListener("keyup", e => {
        const texto = e.target.value.toLowerCase();
        // Busca tanto .card (inicio) como .tarjeta (categorías)
        const productos = document.querySelectorAll(".card, .tarjeta");

        productos.forEach(el => {
            el.textContent.toLowerCase().includes(texto)
                ? el.style.display = "block"
                : el.style.display = "none";
        });
    });
}