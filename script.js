/**
 * Lógica Global JS - Ferretería Los 4H
 * Incluye: Navegación, Búsqueda global JSON y Envío a WhatsApp
 */

// 1. Variable global para guardar el inventario (fuera de todo para que sea accesible)
let inventarioCompleto = [];

// 2. Función para cargar el JSON de productos
async function cargarInventario() {
    try {
        const respuesta = await fetch('TABLE.json'); // Asegúrate de que el nombre sea exacto
        if (!respuesta.ok) throw new Error("No se pudo cargar el archivo");
        inventarioCompleto = await respuesta.json();
        console.log("✅ Inventario cargado:", inventarioCompleto.length, "productos.");
    } catch (error) {
        console.error("❌ Error cargando JSON:", error);
    }
}

// 3. Función que filtra los productos y los pinta en la pantalla
function realizarBusqueda(query) {
    const contenedorResultados = document.getElementById('contenedor-resultados');
    
    // Si no existe el contenedor en el HTML de esta página, mostramos error en consola
    if (!contenedorResultados) {
        console.warn("⚠️ No se encontró el <div id='contenedor-resultados'></div> en el HTML.");
        return;
    }

    // Si la búsqueda está vacía, limpiamos el contenedor
    if (query === "") {
        contenedorResultados.innerHTML = "";
        return;
    }

    const busqueda = query.toLowerCase();

    // Filtramos buscando en Descripción o en Código (Producto)
    const resultados = inventarioCompleto.filter(item => {
        const descripcion = item.Descripción ? item.Descripción.toLowerCase() : "";
        const codigo = item.Producto ? item.Producto.toString().toLowerCase() : "";
        
        return descripcion.includes(busqueda) || codigo.includes(busqueda);
    });

    // Pintamos los resultados
    contenedorResultados.innerHTML = ""; // Limpiamos la búsqueda anterior

    if (resultados.length === 0) {
        contenedorResultados.innerHTML = `<p style="padding: 20px; text-align: center; color: #666;">No se encontraron resultados para "${query}".</p>`;
        return;
    }

    // Creamos las tarjetas para cada producto encontrado
    resultados.forEach(item => {
        contenedorResultados.innerHTML += `
            <div style="border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: #fff;">
                <span style="background: #007bff; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px;">${item.Categoría}</span>
                <h3 style="margin: 10px 0 5px 0; color: #333;">${item.Descripción}</h3>
                <p style="margin: 0; color: #666; font-size: 14px;"><strong>Código:</strong> ${item.Producto} | <strong>Medida:</strong> ${item.Medida}</p>
            </div>
        `;
    });
}

// --- EVENTO PRINCIPAL AL CARGAR LA PÁGINA ---
document.addEventListener('DOMContentLoaded', function() {
    
    // Cargar los productos desde el JSON apenas abre la página
    cargarInventario();
    
    // --- 1. LÓGICA DEL FORMULARIO DE WHATSAPP ---
    const form = document.getElementById('whatsapp-form');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const producto = document.getElementById('producto').value;
            const mensaje = document.getElementById('mensaje').value;
            const telefono = "50379500328";

            const textoMensaje = `Hola Ferretería Los 4H! 👋\n\n` +
                                 `*Nombre:* ${nombre}\n` +
                                 `*Producto:* ${producto}\n` +
                                 `*Detalles:* ${mensaje}`;

            const mensajeCodificado = encodeURIComponent(textoMensaje);
            const urlWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;
            window.open(urlWhatsApp, '_blank');
        });
    }

    // --- 2. LÓGICA DE LA BARRA DE BÚSQUEDA ---
    const searchBtn = document.querySelector('.search-box button');
    const searchInput = document.querySelector('.search-box input');

    if (searchBtn && searchInput) {
        // Al hacer clic en el botón de la lupa
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            realizarBusqueda(query);
        });

        // Al presionar la tecla "Enter"
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita que se recargue la página si el input está en un form
                searchBtn.click();
            }
        });

        // Opcional: Búsqueda "En vivo" (busca mientras el usuario va escribiendo letra por letra)
        searchInput.addEventListener('input', function() {
            realizarBusqueda(this.value.trim());
        });
    }

    // --- 3. LÓGICA DE NAVEGACIÓN ACTIVA ---
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        // Manejamos el caso de la raíz "/" para que marque index.html
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === "" && href === "index.html")) {
            link.classList.add('active');
        }
    });
});