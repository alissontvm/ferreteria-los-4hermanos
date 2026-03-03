// 1. Variable global para almacenar los datos del JSON
let inventarioCompleto = [];

/**
 * 2. Función para cargar el archivo JSON
 * Se ejecuta automáticamente al cargar la página.
 */
async function cargarInventario() {
    try {
        // Asegúrate de que "TABLE.json" sea el nombre exacto de tu archivo
        const respuesta = await fetch('TABLE.json');
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        inventarioCompleto = await respuesta.json();
        console.log("✅ Conexión exitosa. Inventario cargado:", inventarioCompleto.length, "productos.");
    } catch (error) {
        console.error("❌ Error al conectar con el JSON:", error);
    }
}

/**
 * 3. Función principal de búsqueda
 * Filtra en todo el array sin importar la categoría.
 */
function buscarProducto(termino) {
    // Si el usuario borra todo, puedes limpiar los resultados o mostrar un mensaje
    if (termino.trim() === "") {
        document.getElementById('contenedor-productos').innerHTML = "";
        return;
    }

    const busqueda = termino.toLowerCase();

    // Filtramos en el array global
    const resultados = inventarioCompleto.filter(item => {
        const descripcion = item.Descripción ? item.Descripción.toLowerCase() : "";
        const codigo = item.Producto ? item.Producto.toString().toLowerCase() : "";
        const categoria = item.Categoría ? item.Categoría.toLowerCase() : "";

        // Busca coincidencias en descripción, código o categoría
        return descripcion.includes(busqueda) || 
               codigo.includes(busqueda) || 
               categoria.includes(busqueda);
    });

    renderizarResultados(resultados);
}

/**
 * 4. Función para dibujar los resultados en el HTML
 */
function renderizarResultados(listaFiltrada) {
    const contenedor = document.getElementById('contenedor-productos');
    
    // Verificamos que el contenedor exista en el HTML actual
    if (!contenedor) {
        console.warn("⚠️ No se encontró el elemento con ID 'contenedor-productos'");
        return;
    }

    contenedor.innerHTML = ""; // Limpiar contenido previo

    if (listaFiltrada.length === 0) {
        contenedor.innerHTML = `<p class="no-results">No se encontraron productos que coincidan con tu búsqueda.</p>`;
        return;
    }

    // Creamos el HTML para cada producto encontrado
    listaFiltrada.forEach(item => {
        const card = document.createElement('div');
        card.className = "producto-card"; // Puedes darle estilos en tu CSS
        
        card.innerHTML = `
            <div class="categoria-tag">${item.Categoría}</div>
            <h3>${item.Descripción}</h3>
            <div class="detalles">
                <span><strong>Código:</strong> ${item.Producto}</span>
                <span><strong>Medida:</strong> ${item.Medida}</span>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// 5. EVENT LISTENERS
// Cargar los datos en cuanto el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarInventario);