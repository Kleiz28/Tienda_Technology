let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let categorias = [];
let productosDesdeAPI = [];
// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Mostrar sección específica
function mostrarSeccion(idSeccion) {
    document.querySelectorAll('.seccion').forEach(seccion => {
        seccion.classList.remove('activa');
    });

    document.getElementById(idSeccion).classList.add('activa');

    document.querySelectorAll('.nav-link').forEach(enlace => {
        enlace.classList.remove('active');
    });

    if (idSeccion === 'productos') {
        filtrarProductos();
    }

    if (idSeccion === 'carrito') {
        actualizarCarrito();
    }

    window.scrollTo(0, 0);
}

// Modificar la función cargarProductosDestacados para usar productos desde API
function cargarProductosDestacados() {
    const contenedorDestacados = document.getElementById('productos-destacados');
    if (!contenedorDestacados) return;

    contenedorDestacados.innerHTML = '';

    const productosDestacados = [...productosDesdeAPI]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

    productosDestacados.forEach(producto => {
        const tarjetaProducto = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${producto.imagen || 'https://via.placeholder.com/300x200?text=Imagen+No+Disponible'}" 
                         class="card-img-top" alt="${producto.nombre}"
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion || 'Sin descripción'}</p>
                        <p class="precio">S/${(parseFloat(producto.precio) || 0).toFixed(2)}</p>
                        <button class="btn btn-sm btn-primary" onclick="agregarAlCarrito(${producto.id})">
                            Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedorDestacados.innerHTML += tarjetaProducto;
    });
}



// Función mejorada para cargar categorías
// Versión con endpoints alternativos
async function cargarCategoriasDesdeAPI() {
    const endpoints = [
        '/api/tienda/categorias',  // Nuevo endpoint
        '/categorias/api/tienda/activas',
        '/categorias/api/activas'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Probando endpoint: ${endpoint}`);
            const response = await fetch(endpoint);

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log(`✅ Éxito con endpoint: ${endpoint}`);
                    return data.data;
                }
            }
        } catch (error) {
            console.warn(`Error con endpoint ${endpoint}:`, error.message);
        }
    }

    console.warn('⚠️ Todos los endpoints fallaron, usando categorías por defecto');
    return getCategoriasPorDefecto();
}

// Función para cargar productos desde API
async function cargarProductosDesdeAPI() {
    const endpoints = [
        '/api/tienda/productos',  // Nuevo endpoint
        '/productos/api/activos'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Cargando productos desde: ${endpoint}`);
            const response = await fetch(endpoint);

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    console.log(`✅ Productos cargados: ${data.data.length}`);
                    return data.data;
                }
            }
        } catch (error) {
            console.warn(`Error cargando productos desde ${endpoint}:`, error.message);
        }
    }

    console.warn('⚠️ No se pudieron cargar productos desde API, usando datos locales');
    return productos; // Fallback a datos locales
}

// Función de categorías por defecto
function getCategoriasPorDefecto() {
    return [
        { id: 1, nombre: "Computadora", valor: "computadora" },
        { id: 2, nombre: "Televisor", valor: "televisor" },
        { id: 3, nombre: "Drones", valor: "drones" }
    ];
}

// Función para inicializar la tienda
async function inicializarTienda() {
    try {
        // Cargar categorías y productos en paralelo
        const [categoriasCargadas, productosCargados] = await Promise.all([
            cargarCategoriasDesdeAPI(),
            cargarProductosDesdeAPI()
        ]);

        categorias = categoriasCargadas;
        productosDesdeAPI = productosCargados;

        console.log(`📊 Tienda inicializada: ${categorias.length} categorías, ${productosDesdeAPI.length} productos`);

        // Actualizar la interfaz
        actualizarFiltrosCategorias();
        actualizarCategoriasFooter();
        cargarProductosDestacados();

    } catch (error) {
        console.error('❌ Error inicializando tienda:', error);
        // Usar datos por defecto
        categorias = getCategoriasPorDefecto();
        productosDesdeAPI = productos;
        actualizarFiltrosCategorias();
        actualizarCategoriasFooter();
    }
}

// Función para actualizar los filtros de categoría
function actualizarFiltrosCategorias() {
    const filtrosContainer = document.querySelector('.card-body');
    if (!filtrosContainer) return;

    // Limpiar filtros existentes
    const existingFilters = filtrosContainer.querySelectorAll('.categoria-filter');
    existingFilters.forEach(filter => filter.remove());

    // Agregar nuevos filtros
    categorias.forEach(categoria => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.className = 'form-check mb-2 categoria-filter';
        checkboxDiv.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${categoria.valor}" 
                   id="cat-${categoria.valor}">
            <label class="form-check-label" for="cat-${categoria.valor}">
                ${categoria.nombre}
                ${categoria.cantidadProductos ? `(${categoria.cantidadProductos})` : ''}
            </label>
        `;
        filtrosContainer.appendChild(checkboxDiv);

        // Agregar event listener
        const checkbox = document.getElementById(`cat-${categoria.valor}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => filtrarProductos());
        }
    });
}


// Filtrar productos (usando productos desde API)
async function filtrarProductos(categoria = null) {
    const listaProductos = document.getElementById('lista-productos');
    if (!listaProductos) return;

    listaProductos.innerHTML = '';

    // Obtener categorías seleccionadas
    const categoriasSeleccionadas = [];
    categorias.forEach(cat => {
        const checkbox = document.getElementById(`cat-${cat.valor}`);
        if (checkbox && checkbox.checked) {
            categoriasSeleccionadas.push(cat.valor);
        }
    });

    const filtroPrecio = document.querySelector('input[name="filtroPrecio"]:checked')?.value || 'todos';

    if (categoria) {
        categoriasSeleccionadas.length = 0;
        categoriasSeleccionadas.push(categoria);
        const checkbox = document.getElementById(`cat-${categoria}`);
        if (checkbox) checkbox.checked = true;
    }

    let productosFiltrados = productosDesdeAPI;

    // Filtrar por categoría
    if (categoriasSeleccionadas.length > 0) {
        productosFiltrados = productosFiltrados.filter(producto =>
            categoriasSeleccionadas.includes(producto.categoriaValor || producto.categoria)
        );
    }

    // Filtrar por precio
    if (filtroPrecio !== 'todos') {
        productosFiltrados = productosFiltrados.filter(producto => {
            const precio = parseFloat(producto.precio) || 0;
            if (filtroPrecio === 'bajo') return precio < 1000;
            if (filtroPrecio === 'medio') return precio >= 1000 && precio <= 3000;
            if (filtroPrecio === 'alto') return precio > 3000;
            return true;
        });
    }

    // Mostrar resultados
    if (productosFiltrados.length === 0) {
        listaProductos.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                <p class="mt-3">No se encontraron productos que coincidan con los filtros</p>
            </div>
        `;
    } else {
        productosFiltrados.forEach(producto => {
            const tarjetaProducto = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${producto.imagen || 'https://via.placeholder.com/300x200?text=Imagen+No+Disponible'}" 
                             class="card-img-top" alt="${producto.nombre}" 
                             style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion || 'Sin descripción'}</p>
                            <p class="precio">S/${(parseFloat(producto.precio) || 0).toFixed(2)}</p>
                            <button class="btn btn-sm btn-primary" onclick="agregarAlCarrito(${producto.id})">
                                Añadir al carrito
                            </button>
                        </div>
                    </div>
                </div>
            `;
            listaProductos.innerHTML += tarjetaProducto;
        });
    }
}


// Función para actualizar el footer
function actualizarCategoriasFooter() {
    const footerCategorias = document.querySelector('.col-md-3.mb-1:nth-child(3) ul');
    if (!footerCategorias) return;

    footerCategorias.innerHTML = '';
    categorias.forEach(categoria => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" class="text-decoration-none" onclick="filtrarPorCategoria('${categoria.valor}')">${categoria.nombre}</a>`;
        footerCategorias.appendChild(li);
    });
}

// Ordenar productos
function ordenarProductos(criterio) {
    let productosOrdenados = [...productos];

    switch(criterio) {
        case 'nombre':
            productosOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
            break;
        case 'precio-asc':
            productosOrdenados.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            productosOrdenados.sort((a, b) => b.precio - a.precio);
            break;
    }

    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    productosOrdenados.forEach(producto => {
        const tarjetaProducto = `
            <div class="col-md-4 mb-4">
                <div class="card h-100">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">${producto.descripcion}</p>
                        <p class="precio">S/${producto.precio.toFixed(2)}</p>
                        <button class="btn btn-sm btn-primary" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;
        listaProductos.innerHTML += tarjetaProducto;
    });
}

// Buscar productos
function buscarProductos(evento) {
    evento.preventDefault();
    const terminoBusqueda = document.getElementById('busqueda').value.toLowerCase();

    if (terminoBusqueda.trim() === '') {
        filtrarProductos();
        return;
    }

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(terminoBusqueda) ||
        producto.descripcion.toLowerCase().includes(terminoBusqueda) ||
        producto.categoria.toLowerCase().includes(terminoBusqueda)
    );

    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    if (productosFiltrados.length === 0) {
        listaProductos.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                <p class="mt-3">No se encontraron productos para "${terminoBusqueda}"</p>
            </div>
        `;
    } else {
        productosFiltrados.forEach(producto => {
            const tarjetaProducto = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion}</p>
                            <p class="precio">S/${producto.precio.toFixed(2)}</p>
                            <button class="btn btn-sm btn-primary" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            `;
            listaProductos.innerHTML += tarjetaProducto;
        });
    }

    mostrarSeccion('productos');
}

// Modificar agregarAlCarrito para buscar en productosDesdeAPI
function agregarAlCarrito(idProducto) {
    const producto = productosDesdeAPI.find(p => p.id === idProducto) ||
        productos.find(p => p.id === idProducto);

    if (!producto) {
        console.error('Producto no encontrado:', idProducto);
        return;
    }

    const itemExistente = carrito.find(item => item.id === idProducto);

    if (itemExistente) {
        itemExistente.cantidad += 1;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: parseFloat(producto.precio) || 0,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarContadorCarrito();

    if (document.getElementById('carrito').classList.contains('activa')) {
        actualizarCarrito();
    }

    // Mostrar notificación
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success position-fixed bottom-0 end-0 m-3';
    alerta.style.zIndex = '1050';
    alerta.innerHTML = `<i class="bi bi-check-circle-fill"></i> Producto añadido al carrito`;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
}

// Actualizar contador del carrito
function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        contador.textContent = totalItems;
    }
}

// Actualizar cantidad de un producto en el carrito
function actualizarCantidad(idProducto, nuevaCantidad) {
    const item = carrito.find(item => item.id == idProducto);

    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(idProducto);
        } else {
            item.cantidad = nuevaCantidad;
            guardarCarrito();
            actualizarCarrito();
            actualizarContadorCarrito();
        }
    }
}

// Actualizar carrito
function actualizarCarrito() {
    const itemsCarrito = document.getElementById('items-carrito');
    const mensajeCarritoVacio = document.getElementById('mensaje-carrito-vacio');
    const btnPagar = document.getElementById('btn-pagar');

    if (!itemsCarrito) return;

    if (carrito.length === 0) {
        if (mensajeCarritoVacio) mensajeCarritoVacio.style.display = 'block';
        if (btnPagar) btnPagar.disabled = true;
        document.getElementById('subtotal').textContent = 'S/0.00';
        document.getElementById('envio').textContent = 'S/0.00';
        document.getElementById('total').textContent = 'S/0.00';
        return;
    }

    if (mensajeCarritoVacio) mensajeCarritoVacio.style.display = 'none';
    if (btnPagar) btnPagar.disabled = false;

    const subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    const envio = subtotal > 0 ? 5.99 : 0;
    const total = subtotal + envio;

    document.getElementById('subtotal').textContent = `S/${subtotal.toFixed(2)}`;
    document.getElementById('envio').textContent = `S/${envio.toFixed(2)}`;
    document.getElementById('total').textContent = `S/${total.toFixed(2)}`;

    itemsCarrito.innerHTML = '';
    carrito.forEach(item => {
        const itemCarrito = `
            <div class="item-carrito d-flex mb-3 p-3 border rounded">
                <img src="${item.imagen}" alt="${item.nombre}" class="imagen-producto me-3" style="width: 100px; height: 100px; object-fit: cover;">
                <div class="flex-grow-1">
                    <h5>${item.nombre}</h5>
                    <p>S/${item.precio.toFixed(2)} x ${item.cantidad}</p>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-secondary me-2" onclick="actualizarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                    <span class="mx-2">${item.cantidad}</span>
                    <button class="btn btn-sm btn-outline-secondary ms-2" onclick="actualizarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                    <button class="btn btn-sm btn-outline-danger ms-3" onclick="eliminarDelCarrito(${item.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        itemsCarrito.innerHTML += itemCarrito;
    });
}

// Eliminar producto del carrito
function eliminarDelCarrito(idProducto) {

    Swal.fire({
        title: "¿Estás seguro de eliminar el producto?",
        text: "No se prodrá revertir.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar"
    }).then((result) => {
        if (result.isConfirmed) {

            carrito = carrito.filter(item => item.id != idProducto);
            guardarCarrito();
            actualizarCarrito();
            actualizarContadorCarrito();
            actualizarCarrito();

            Swal.fire({
                title: "Eliminado!",
                text: "El registro se eliminó correctamente",
                icon: "success"
            });
        }
    });
}


// Buscar productos
function buscarProductos(evento) {
    if (evento) evento.preventDefault();

    const terminoBusqueda = document.getElementById('busqueda').value.toLowerCase().trim();

    if (terminoBusqueda === '') {
        filtrarProductos();
        return;
    }

    const productosFiltrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(terminoBusqueda) ||
        producto.descripcion.toLowerCase().includes(terminoBusqueda) ||
        producto.categoria.toLowerCase().includes(terminoBusqueda)
    );

    mostrarResultadosBusqueda(productosFiltrados, terminoBusqueda);
}

// Mostrar resultados de búsqueda
function mostrarResultadosBusqueda(productosFiltrados, terminoBusqueda) {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    if (productosFiltrados.length === 0) {
        listaProductos.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-search" style="font-size: 3rem; color: #ccc;"></i>
                <p class="mt-3">No se encontraron productos para "${terminoBusqueda}"</p>
                <button class="btn btn-primary mt-2" onclick="limpiarBusqueda()">
                    Ver todos los productos
                </button>
            </div>
        `;
    } else {
        listaProductos.innerHTML = `
            <div class="col-12 mb-3">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i> 
                    Se encontraron ${productosFiltrados.length} producto(s) para: "${terminoBusqueda}"
                    <button class="btn btn-sm btn-outline-secondary ms-3" onclick="limpiarBusqueda()">
                        Limpiar búsqueda
                    </button>
                </div>
            </div>
        `;

        productosFiltrados.forEach(producto => {
            const tarjetaProducto = `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">${producto.descripcion}</p>
                            <p class="precio">S/${producto.precio.toFixed(2)}</p>
                            <button class="btn btn-sm btn-primary" onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
                        </div>
                    </div>
                </div>
            `;
            listaProductos.innerHTML += tarjetaProducto;
        });
    }
}

// Limpiar búsqueda
function limpiarBusqueda() {
    document.getElementById('busqueda').value = '';
    filtrarProductos();
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', async function() {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Inicializar la tienda
    await inicializarTienda();

    // Configurar event listeners globales
    window.agregarAlCarrito = agregarAlCarrito;
    window.actualizarCantidad = actualizarCantidad;
    window.eliminarDelCarrito = eliminarDelCarrito;
    window.actualizarCarrito = actualizarCarrito;
    window.filtrarProductos = filtrarProductos;
    window.filtrarPorCategoria = filtrarPorCategoria;
    window.ordenarProductos = ordenarProductos;
    window.buscarProductos = buscarProductos;
    window.limpiarBusqueda = limpiarBusqueda;
    window.mostrarSeccion = mostrarSeccion;

    actualizarContadorCarrito();

    if (document.getElementById('carrito').classList.contains('activa')) {
        actualizarCarrito();
    }
});

// API - ExchangeRate - CONVERSOR DE MONEDAS
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const amountInput = document.getElementById('amount');
    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');
    const convertButton = document.getElementById('convertButton');
    const swapButton = document.getElementById('swapCurrencies');
    const conversionResult = document.getElementById('conversionResult');
    const inverseResult = document.getElementById('inverseResult');
    const lastUpdate = document.getElementById('lastUpdate');

    // Tasas de cambio
    let exchangeRates = {};
    let lastUpdated = null;

    // Cargar tasas de cambio al iniciar
    fetchExchangeRates();

    // Convertir monedas
    convertButton.addEventListener('click', convertCurrency);

    // Intercambiar monedas
    swapButton.addEventListener('click', function() {
        const temp = fromCurrencySelect.value;
        fromCurrencySelect.value = toCurrencySelect.value;
        toCurrencySelect.value = temp;
        convertCurrency();
    });

    // Actualizar cuando cambia el monto
    amountInput.addEventListener('input', convertCurrency);

    // Actualizar cuando cambian las monedas
    fromCurrencySelect.addEventListener('change', convertCurrency);
    toCurrencySelect.addEventListener('change', convertCurrency);

    // Función para obtener tasas de cambio
    async function fetchExchangeRates() {
        try {
            const response = await fetch('https://open.er-api.com/v6/latest/USD');
            const data = await response.json();

            if (data.result === 'success') {
                exchangeRates = data.rates;
                lastUpdated = new Date(data.time_last_update_utc);
                lastUpdate.textContent = `Última actualización: ${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`;
                convertCurrency();
            } else {
                throw new Error('Error al obtener tasas de cambio');
            }
        } catch (error) {
            console.error('Error:', error);
            lastUpdate.textContent = 'Error al cargar tasas de cambio. Intentando nuevamente...';
            // Reintentar después de 5 segundos
            setTimeout(fetchExchangeRates, 5000);
        }
    }

    // Función para convertir monedas
    function convertCurrency() {
        if (Object.keys(exchangeRates).length === 0) return;

        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount < 0) {
            conversionResult.textContent = 'Monto inválido';
            inverseResult.textContent = '';
            return;
        }

        const fromCurrency = fromCurrencySelect.value;
        const toCurrency = toCurrencySelect.value;

        // Si es la misma moneda
        if (fromCurrency === toCurrency) {
            const result = amount.toFixed(2);
            conversionResult.textContent = `${amount} ${fromCurrency} = ${result} ${toCurrency}`;
            inverseResult.textContent = `${result} ${toCurrency} = ${amount} ${fromCurrency}`;
            return;
        }

        // Convertir a USD primero si es necesario
        let amountInUSD = fromCurrency === 'USD'
            ? amount
            : amount / exchangeRates[fromCurrency];

        // Convertir de USD a la moneda objetivo
        const result = toCurrency === 'USD'
            ? amountInUSD
            : amountInUSD * exchangeRates[toCurrency];

        // Calcular la tasa inversa
        const inverseRate = 1 / (result / amount);

        // Mostrar resultados
        conversionResult.textContent = `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
        inverseResult.textContent = `1 ${toCurrency} = ${inverseRate.toFixed(4)} ${fromCurrency}`;
    }

    // Actualizar tasas cada 30 minutos
    setInterval(fetchExchangeRates, 30 * 60 * 1000);
});