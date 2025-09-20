const productos = [
    {
        id: 1,
        nombre: "Smart TV 4K 55 Pulgadas",
        categoria: "televisor",
        precio: 1899.99,
        imagen: "https://images.samsung.com/is/image/samsung/es-uhd-ku6500-ue55ku6500uxxc-008-composite2-black?$L2-Thumbnail$",
        descripcion: "Televisor inteligente con resolución 4K UHD, HDR10 y sistema operativo Android TV."
    },
    {
        id: 2,
        nombre: "Drone DJI Mavic Air 2",
        categoria: "drones",
        precio: 3299.99,
        imagen: "https://m.media-amazon.com/images/I/71C2W+bBW6L._AC_.jpg",
        descripcion: "Drone profesional con cámara 4K, 48MP y autonomía de vuelo de 34 minutos."
    },
    {
        id: 3,
        nombre: "Laptop Gamer ASUS ROG",
        categoria: "computadora",
        precio: 4599.99,
        imagen: "https://m.media-amazon.com/images/I/81RIr5YR3QL._AC_SL1500_.jpg",
        descripcion: "Laptop gaming con procesador Intel i7, RTX 3060 y 16GB RAM para máximo rendimiento."
    },
    {
        id: 4,
        nombre: "OLED TV 65 Pulgadas Sony",
        categoria: "televisor",
        precio: 4299.99,
        imagen: "https://m.media-amazon.com/images/I/81aMS6p4xlL.jpg",
        descripcion: "Televisor OLED con calidad de imagen excepcional, Dolby Vision y sonido Acoustic Surface."
    },
    {
        id: 5,
        nombre: "Drone Autel EVO Lite+",
        categoria: "drones",
        precio: 2899.99,
        imagen: "https://img.kentfaith.com/cache/catalog/products/us/GW47.0015/GW47.0015-1-1200x1200.jpg",
        descripcion: "Drone con cámara 6K, sensor de 1 pulgada y evitación de obstáculos inteligente."
    },
    {
        id: 6,
        nombre: "MacBook Pro 14 M2 Pro",
        categoria: "computadora",
        precio: 7899.99,
        imagen: "https://es.digitaltrends.com/wp-content/uploads/2023/01/macboo-pro-14-m2-pro-26.jpg?p=1",
        descripcion: "Laptop profesional con chip M2 Pro, pantalla Liquid Retina XDR y 16GB de memoria unificada."
    },
    {
        id: 7,
        nombre: "QLED TV 75 Pulgadas Samsung",
        categoria: "televisor",
        precio: 3499.99,
        imagen: "https://images.samsung.com/is/image/samsung/p6pim/br/qn75qn85cagxzd/gallery/br-qled-tv-qn75qn85cagxzd-qn--qn--cagxzd-thumb-536764565",
        descripcion: "Smart TV QLED con Quantum HDR, Alexa integrada y diseño sin bordes."
    },
    {
        id: 8,
        nombre: "Drone DJI Mini 3 Pro",
        categoria: "drones",
        precio: 2499.99,
        imagen: "https://th.bing.com/th/id/R.3b5253c2ebb0316e3da2d6601a98073e?rik=4C8WK1l3U4XD6A&pid=ImgRaw&r=0",
        descripcion: "Drone compacto con cámara 4K, menos de 249g y seguimiento de sujetos automático."
    },
    {
        id: 9,
        nombre: "PC Gamer Ryzen 7 RTX 4070",
        categoria: "computadora",
        precio: 5999.99,
        imagen: "https://etchile.net/wp-content/uploads/2024/04/pc_gamer_5700x_GBT_RTX4070_off_02-768x768.jpg",
        descripcion: "Computadora de escritorio con Ryzen 7 5800X, RTX 4070 12GB, 32GB RAM y SSD 1TB."
    },
    {
        id: 10,
        nombre: "Smart TV 32 Pulgadas HD",
        categoria: "televisor",
        precio: 899.99,
        imagen: "https://www.claroshop.com/c/algolia/assets/categorias/c-pantallas-smartv.webp",
        descripcion: "Televisor HD perfecto para dormitorios, con Smart TV y múltiples puertos HDMI."
    },
    {
        id: 11,
        nombre: "Drone Holy Stone HS720",
        categoria: "drones",
        precio: 1299.99,
        imagen: "https://i5.walmartimages.com/asr/00eeb04a-6c11-4451-b3e9-390a73c2fdca.c6c7568d7eeeea05b856c0e96be7ca62.jpeg",
        descripcion: "Drone para principiantes con GPS, cámara 4K y función de retorno automático."
    },
    {
        id: 12,
        nombre: "Laptop Dell XPS 13",
        categoria: "computadora",
        precio: 4299.99,
        imagen: "https://www.windowscentral.com/sites/wpcentral.com/files/styles/xlarge_wm_brb/public/field/image/2016/12/dell-xps-13-hero.jpg?itok=PcpkH19l",
        descripcion: "Ultrabook premium con pantalla InfinityEdge, Intel i7 y 16GB RAM, ideal para trabajo."
    }
];

// Carrito de compras
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

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

// Cargar productos destacados
function cargarProductosDestacados() {
    const contenedorDestacados = document.getElementById('productos-destacados');
    contenedorDestacados.innerHTML = '';

    const productosDestacados = [...productos].sort(() => 0.5 - Math.random()).slice(0, 3);

    productosDestacados.forEach(producto => {
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
        contenedorDestacados.innerHTML += tarjetaProducto;
    });
}

// Filtrar productos
function filtrarProductos(categoria = null) {
    const listaProductos = document.getElementById('lista-productos');
    listaProductos.innerHTML = '';

    const categoriasSeleccionadas = [];
    if (document.getElementById('cat-computadora').checked) categoriasSeleccionadas.push('computadora');
    if (document.getElementById('cat-televisor').checked) categoriasSeleccionadas.push('televisor');
    if (document.getElementById('cat-drones').checked) categoriasSeleccionadas.push('drones');

    const filtroPrecio = document.querySelector('input[name="filtroPrecio"]:checked').value;

    if (categoria) {
        categoriasSeleccionadas.length = 0;
        categoriasSeleccionadas.push(categoria);
        document.getElementById(`cat-${categoria}`).checked = true;
    }

    let productosFiltrados = productos;

    if (categoriasSeleccionadas.length > 0) {
        productosFiltrados = productosFiltrados.filter(producto =>
            categoriasSeleccionadas.includes(producto.categoria)
        );
    }

    if (filtroPrecio !== 'todos') {
        productosFiltrados = productosFiltrados.filter(producto => {
            if (filtroPrecio === 'bajo') return producto.precio < 1000;
            if (filtroPrecio === 'medio') return producto.precio >= 1000 && producto.precio <= 3000;
            if (filtroPrecio === 'alto') return producto.precio > 3000;
            return true;
        });
    }

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

// Añadir producto al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);

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
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    guardarCarrito();

    actualizarContadorCarrito();

    if (document.getElementById('carrito').classList.contains('activa')) {
        actualizarCarrito();
    }

    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success position-fixed bottom-0 end-0 m-3';
    alerta.style.zIndex = '1050';
    alerta.innerHTML = `
        <i class="bi bi-check-circle-fill"></i> Producto añadido al carrito
    `;
    document.body.appendChild(alerta);

    setTimeout(() => {
        alerta.remove();
    }, 3000);
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
document.addEventListener('DOMContentLoaded', function() {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    window.agregarAlCarrito = agregarAlCarrito;
    window.actualizarCantidad = actualizarCantidad;
    window.eliminarDelCarrito = eliminarDelCarrito;
    window.actualizarCarrito = actualizarCarrito;
    window.filtrarProductos = filtrarProductos;
    window.ordenarProductos = ordenarProductos;
    window.buscarProductos = buscarProductos;
    window.limpiarBusqueda = limpiarBusqueda;
    window.mostrarSeccion = mostrarSeccion;

    cargarProductosDestacados();
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