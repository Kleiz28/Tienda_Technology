/**
 * Script para la gestión de productos
 * Archivo: src/main/resources/static/js/productos.js
 */

$(document).ready(function() {
    // Variables globales
    let dataTable;
    let isEditing = false;
    let productoModal;
    let categorias = []; // Array para almacenar las categorías

    // Configuración inicial
    const API_BASE = '/productos/api';
    const CATEGORIAS_API = '/categorias/api/activas'; // Nueva API para categorías
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        activos: `${API_BASE}/activos`,
        stockBajo: `${API_BASE}/stock-bajo`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        cambiarEstado: (id, estado) => `${API_BASE}/cambiar-estado/${id}?estado=${estado}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`,
        buscar: (tipo, valor) => `${API_BASE}/buscar?tipo=${tipo}&valor=${encodeURIComponent(valor)}`
    };

    // Inicializar Componentes
    initializeDataTable();
    productoModal = new bootstrap.Modal(document.getElementById('productoModal'));
    cargarCategorias(); // Cargar categorías al iniciar

    // Event Listeners
    setupEventListeners();

    /**
     * Carga las categorías activas desde el servidor
     */
    function cargarCategorias() {
        fetch(CATEGORIAS_API)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    categorias = result.data;
                    actualizarSelectorCategorias();
                } else {
                    console.error('Error al cargar categorías:', result.message);
                }
            })
            .catch(error => {
                console.error('Error al cargar categorías:', error);
                showNotification('Error', 'No se pudieron cargar las categorías', 'error');
            });
    }

    /**
     * Actualiza el selector de categorías con las categorías cargadas
     */
    function actualizarSelectorCategorias() {
        const select = document.getElementById('categoria');

        // Limpiar opciones excepto la primera
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Agregar categorías al selector
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            select.appendChild(option);
        });
    }

    /**
     * Inicializa DataTable
     */
    function initializeDataTable() {
        dataTable = $('#tablaProductos').DataTable({
            responsive: true,
            processing: true,
            ajax: {
                url: ENDPOINTS.list,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: 'fotoUrl',
                    render: (data) => data ?
                        `<img src="${data}" class="img-producto" alt="Foto producto" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkIi8+Cjx0ZXh0IHg9IjI1IiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gaW1hZ2VuPC90ZXh0Pgo8L3N2Zz4K'">` :
                        '<div class="img-producto bg-light d-flex align-items-center justify-content-center"><small>Sin foto</small></div>'
                },
                { data: 'id' },
                { data: 'nombre' },
                { data: 'marca' },
                {
                    data: 'categoria',
                    render: (data) => data || '<span class="text-muted">Sin categoría</span>'
                },
                {
                    data: null,
                    render: (data) => {
                        const stockBajo = data.stockActual <= data.stockMinimo;
                        const claseStock = stockBajo ? 'text-danger fw-bold' : '';
                        return `<span class="${claseStock}">${data.stockActual} / ${data.stockMinimo}</span>`;
                    }
                },
                {
                    data: 'precioUnitario',
                    render: (data) => `S/ ${parseFloat(data).toFixed(2)}`
                },
                {
                    data: 'estado',
                    render: (data) => {
                        const clases = {
                            'ACTIVO': 'badge text-bg-success',
                            'INACTIVO': 'badge text-bg-warning',
                            'ELIMINADO': 'badge text-bg-danger'
                        };
                        return `<span class="${clases[data]}">${data}</span>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: (data, type, row) => createActionButtons(row)
                }
            ],
            createdRow: function(row, data, dataIndex) {
                if (data.stockActual <= data.stockMinimo) {
                    $(row).addClass('stock-bajo');
                }
                if (data.estado === 'INACTIVO' || data.estado === 'ELIMINADO') {
                    $(row).addClass('producto-inactivo');
                }
            },
            columnDefs: [
                { responsivePriority: 1, targets: 2 },
                { responsivePriority: 2, targets: 8 },
            ],
            language: { url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json" },
            pageLength: 10
        });
    }

    /**
     * Crea los botones de acción para cada fila
     */
    function createActionButtons(row) {
        const puedeEditar = row.estado === 'ACTIVO' || row.estado === 'INACTIVO';
        const puedeActivar = row.estado === 'INACTIVO';
        const puedeInactivar = row.estado === 'ACTIVO';
        const puedeEliminar = row.estado !== 'ELIMINADO';

        return `
            <div class="d-flex gap-1">
                ${puedeEditar ? `
                    <button data-id="${row.id}" class="btn btn-sm btn-primary action-edit" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </button>
                ` : ''}
                
                ${puedeInactivar ? `
                    <button data-id="${row.id}" class="btn btn-sm btn-warning action-inactivate" title="Inactivar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M5 6.25a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5zm3.5 0a1.25 1.25 0 1 1 2.5 0v3.5a1.25 1.25 0 1 1-2.5 0v-3.5z"/>
                        </svg>
                    </button>
                ` : ''}
                
                ${puedeActivar ? `
                    <button data-id="${row.id}" class="btn btn-sm btn-success action-activate" title="Activar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                        </svg>
                    </button>
                ` : ''}
                
                ${puedeEliminar ? `
                    <button data-id="${row.id}" class="btn btn-sm btn-danger action-delete" title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                    </button>
                ` : ''}
            </div>
        `;
    }

    /**
     * Configura los event listeners
     */
    function setupEventListeners() {
        // Botón nuevo producto
        $('#btnNuevoRegistro').click(openCreateModal);

        // Botón buscar
        $('#btnBuscar').click(handleSearch);

        // Enter en campo de búsqueda
        $('#filtroValor').keypress(function(e) {
            if (e.which === 13) {
                handleSearch();
            }
        });

        // Cambio en tipo de filtro
        $('#filtroTipo').change(function() {
            const tipo = $(this).val();
            if (tipo === 'STOCK_BAJO') {
                $('#filtroValor').prop('disabled', true).val('');
            } else {
                $('#filtroValor').prop('disabled', false);
            }
        });

        // Delegación de eventos para los botones de acción
        $('#tablaProductos tbody').on('click', '.action-edit', function() {
            const id = $(this).data('id');
            openEditModal(id);
        });

        $('#tablaProductos tbody').on('click', '.action-activate', function() {
            const id = $(this).data('id');
            cambiarEstadoProducto(id, 'ACTIVO');
        });

        $('#tablaProductos tbody').on('click', '.action-inactivate', function() {
            const id = $(this).data('id');
            cambiarEstadoProducto(id, 'INACTIVO');
        });

        $('#tablaProductos tbody').on('click', '.action-delete', function() {
            const id = $(this).data('id');
            eliminarProducto(id);
        });

        // Envío del formulario
        $('#formProducto').submit(handleFormSubmit);

        // Validación en tiempo real
        setupFormValidation();

        // Validar categoría al cambiar selección
        $('#categoria').change(function() {
            validateField(this);
        });
    }

    /**
     * Configura la validación del formulario
     */
    function setupFormValidation() {
        const form = document.getElementById('formProducto');

        // Validación en tiempo real para campos requeridos
        form.querySelectorAll('input[required], select[required]').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => clearFieldError(field));
        });
    }

    /**
     * Valida un campo individual
     */
    function validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.id}-error`);

        if (field.hasAttribute('required') && !value) {
            showFieldError(field, 'Este campo es obligatorio');
            return false;
        }

        // Validación específica para categoría
        if (field.id === 'categoria' && !value) {
            showFieldError(field, 'Debe seleccionar una categoría');
            return false;
        }

        if (field.type === 'number') {
            const min = field.getAttribute('min');
            if (min !== null && parseFloat(value) < parseFloat(min)) {
                showFieldError(field, `El valor debe ser mayor o igual a ${min}`);
                return false;
            }
        }

        if (field.type === 'url' && value && !isValidUrl(value)) {
            showFieldError(field, 'Ingrese una URL válida');
            return false;
        }

        clearFieldError(field);
        return true;
    }

    /**
     * Muestra error en un campo
     */
    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /**
     * Limpia el error de un campo
     */
    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = document.getElementById(`${field.id}-error`);
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    /**
     * Valida si una URL es válida
     */
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    /**
     * Valida todo el formulario
     */
    function validateForm() {
        let isValid = true;
        const form = document.getElementById('formProducto');

        form.querySelectorAll('input[required], select[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Validación adicional: stock mínimo debe ser mayor a 0
        const stockMinimo = document.getElementById('stockMinimo');
        if (stockMinimo.value && parseInt(stockMinimo.value) <= 0) {
            showFieldError(stockMinimo, 'El stock mínimo debe ser mayor a 0');
            isValid = false;
        }

        // Validación adicional: precio unitario debe ser mayor a precio de coste
        const precioUnitario = parseFloat(document.getElementById('precioUnitario').value);
        const precioCoste = parseFloat(document.getElementById('precioCoste').value);
        if (precioUnitario && precioCoste && precioUnitario <= precioCoste) {
            showFieldError(document.getElementById('precioUnitario'), 'El precio unitario debe ser mayor al precio de coste');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Abre modal para crear nuevo producto
     */
    function openCreateModal() {
        isEditing = false;
        resetForm();
        document.getElementById('modalTitle').textContent = 'Agregar Producto';

        // Asegurarse de que las categorías estén cargadas
        if (categorias.length === 0) {
            cargarCategorias();
        }

        productoModal.show();
    }

    /**
     * Abre modal para editar producto
     */
    function openEditModal(id) {
        isEditing = true;
        resetForm();
        document.getElementById('modalTitle').textContent = 'Editar Producto';

        fetch(ENDPOINTS.get(id))
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    // Asegurarse de que las categorías estén cargadas antes de poblar el formulario
                    if (categorias.length === 0) {
                        cargarCategorias().then(() => {
                            populateForm(result.data);
                        });
                    } else {
                        populateForm(result.data);
                    }
                    productoModal.show();
                } else {
                    showNotification('Error', result.message, 'error');
                }
            })
            .catch(error => {
                showNotification('Error', 'Error al cargar el producto', 'error');
                console.error('Error:', error);
            });
    }

    /**
     * Llena el formulario con datos del producto
     */
    function populateForm(producto) {
        document.getElementById('id').value = producto.id || '';
        document.getElementById('nombre').value = producto.nombre || '';
        document.getElementById('marca').value = producto.marca || '';
        document.getElementById('codigoBarras').value = producto.codigoBarras || '';
        document.getElementById('fotoUrl').value = producto.fotoUrl || '';
        document.getElementById('stockActual').value = producto.stockActual || 0;
        document.getElementById('stockMinimo').value = producto.stockMinimo || 5;
        document.getElementById('precioUnitario').value = producto.precioUnitario || '';
        document.getElementById('precioCoste').value = producto.precioCoste || '';
        document.getElementById('descripcion').value = producto.descripcion || '';

        // Manejar la categoría (puede ser objeto o ID)
        if (producto.categoria) {
            if (typeof producto.categoria === 'object' && producto.categoria.id) {
                document.getElementById('categoria').value = producto.categoria.id;
            } else if (typeof producto.categoria === 'string') {
                document.getElementById('categoria').value = producto.categoria;
            } else if (typeof producto.categoria === 'number') {
                document.getElementById('categoria').value = producto.categoria.toString();
            }
        }
    }

    /**
     * Resetea el formulario
     */
    function resetForm() {
        document.getElementById('formProducto').reset();
        document.getElementById('id').value = '';

        // Limpiar errores
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        });
        document.querySelectorAll('.invalid-feedback').forEach(element => {
            element.textContent = '';
        });
    }

    /**
     * Maneja el envío del formulario
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            showNotification('Error', 'Por favor, corrija los errores del formulario', 'error');
            return;
        }

        const formData = getFormData();

        fetch(ENDPOINTS.save, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    productoModal.hide();
                    showNotification('Éxito', result.message, 'success');
                    dataTable.ajax.reload();
                } else {
                    showNotification('Error', result.message, 'error');
                }
            })
            .catch(error => {
                showNotification('Error', 'Error al guardar el producto', 'error');
                console.error('Error:', error);
            });
    }

    /**
     * Obtiene los datos del formulario con estructura correcta para categoría
     */
    function getFormData() {
        const categoriaId = document.getElementById('categoria').value;

        return {
            id: document.getElementById('id').value || null,
            nombre: document.getElementById('nombre').value,
            marca: document.getElementById('marca').value,
            categoria: {
                id: categoriaId ? parseInt(categoriaId) : null
            },
            codigoBarras: document.getElementById('codigoBarras').value,
            fotoUrl: document.getElementById('fotoUrl').value,
            stockActual: parseInt(document.getElementById('stockActual').value),
            stockMinimo: parseInt(document.getElementById('stockMinimo').value),
            precioUnitario: parseFloat(document.getElementById('precioUnitario').value),
            precioCoste: parseFloat(document.getElementById('precioCoste').value),
            descripcion: document.getElementById('descripcion').value
        };
    }

    /**
     * Maneja la búsqueda de productos
     */
    function handleSearch() {
        const tipo = $('#filtroTipo').val();
        const valor = $('#filtroValor').val().trim();

        let url;
        if (tipo === 'STOCK_BAJO') {
            url = ENDPOINTS.stockBajo;
        } else if (tipo === 'TODOS' || !valor) {
            url = ENDPOINTS.activos;
        } else {
            url = ENDPOINTS.buscar(tipo, valor);
        }

        dataTable.ajax.url(url).load();
    }

    /**
     * Cambia el estado de un producto
     */
    function cambiarEstadoProducto(id, nuevoEstado) {
        const acciones = {
            'ACTIVO': 'activar',
            'INACTIVO': 'inactivar',
            'ELIMINADO': 'eliminar'
        };

        const accion = acciones[nuevoEstado];

        Swal.fire({
            title: `¿Está seguro?`,
            text: `¿Desea ${accion} este producto?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Sí, ${accion}`,
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(ENDPOINTS.cambiarEstado(id, nuevoEstado), {
                    method: 'POST'
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            showNotification('Éxito', result.message, 'success');
                            dataTable.ajax.reload();
                        } else {
                            showNotification('Error', result.message, 'error');
                        }
                    })
                    .catch(error => {
                        showNotification('Error', `Error al ${accion} el producto`, 'error');
                        console.error('Error:', error);
                    });
            }
        });
    }

    /**
     * Elimina un producto (cambia estado a ELIMINADO)
     */
    function eliminarProducto(id) {
        cambiarEstadoProducto(id, 'ELIMINADO');
    }

    /**
     * Muestra una notificación Toast
     */
    function showNotification(title, message, type) {
        const toastId = 'toast-' + Date.now();
        const bgColor = {
            'success': 'bg-success',
            'error': 'bg-danger',
            'warning': 'bg-warning',
            'info': 'bg-info'
        }[type] || 'bg-info';

        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white ${bgColor} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${title}</strong><br>${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        $('#notification-container').append(toastHtml);
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
        toast.show();

        // Remover el toast del DOM después de que se oculte
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }

    // Inicializar el campo de búsqueda según el tipo seleccionado
    $('#filtroTipo').trigger('change');
});