/**
 * Script para la gestión de categorías
 * Archivo: src/main/resources/static/js/categorias.js
 */

$(document).ready(function() {
    // Variables globales
    let dataTable;
    let isEditing = false;
    let categoriaModal;

    // Configuración inicial
    const API_BASE = '/categorias/api';
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        activas: `${API_BASE}/activas`,
        conProductos: `${API_BASE}/con-productos`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        cambiarEstado: (id, estado) => `${API_BASE}/cambiar-estado/${id}?estado=${estado}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`,
        buscar: (nombre) => `${API_BASE}/buscar?nombre=${encodeURIComponent(nombre)}`,
        estadisticas: `${API_BASE}/estadisticas`
    };

    // Inicializar Componentes
    initializeDataTable();
    categoriaModal = new bootstrap.Modal(document.getElementById('categoriaModal'));
    cargarEstadisticas();

    // Event Listeners
    setupEventListeners();

    /**
     * Inicializa DataTable
     */
    function initializeDataTable() {
        dataTable = $('#tablaCategorias').DataTable({
            responsive: true,
            processing: true,
            ajax: {
                url: ENDPOINTS.list,
                dataSrc: 'data'
            },
            columns: [
                { data: 'id' },
                { data: 'nombre' },
                {
                    data: 'descripcion',
                    render: (data) => data || '<span class="text-muted">Sin descripción</span>'
                },
                {
                    data: 'cantidadProductos',
                    render: (data) => `<span class="badge bg-primary">${data} productos</span>`
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
                if (data.estado === 'INACTIVO' || data.estado === 'ELIMINADO') {
                    $(row).addClass('categoria-inactiva');
                }
            },
            columnDefs: [
                { responsivePriority: 1, targets: 1 },
                { responsivePriority: 2, targets: 5 },
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
        // Botón nueva categoría
        $('#btnNuevoRegistro').click(openCreateModal);

        // Botón buscar
        $('#btnBuscar').click(handleSearch);

        // Enter en campo de búsqueda
        $('#filtroNombre').keypress(function(e) {
            if (e.which === 13) {
                handleSearch();
            }
        });

        // Delegación de eventos para los botones de acción
        $('#tablaCategorias tbody').on('click', '.action-edit', function() {
            const id = $(this).data('id');
            openEditModal(id);
        });

        $('#tablaCategorias tbody').on('click', '.action-activate', function() {
            const id = $(this).data('id');
            cambiarEstadoCategoria(id, 'ACTIVO');
        });

        $('#tablaCategorias tbody').on('click', '.action-inactivate', function() {
            const id = $(this).data('id');
            cambiarEstadoCategoria(id, 'INACTIVO');
        });

        $('#tablaCategorias tbody').on('click', '.action-delete', function() {
            const id = $(this).data('id');
            eliminarCategoria(id);
        });

        // Envío del formulario
        $('#formCategoria').submit(handleFormSubmit);

        // Validación en tiempo real
        setupFormValidation();
    }

    /**
     * Configura la validación del formulario
     */
    function setupFormValidation() {
        const form = document.getElementById('formCategoria');

        // Validación en tiempo real
        form.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
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

        if (field.id === 'nombre' && value.length > 100) {
            showFieldError(field, 'El nombre no puede tener más de 100 caracteres');
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
        errorElement.textContent = message;
    }

    /**
     * Limpia el error de un campo
     */
    function clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorElement = document.getElementById(`${field.id}-error`);
        errorElement.textContent = '';
    }

    /**
     * Valida todo el formulario
     */
    function validateForm() {
        let isValid = true;
        const form = document.getElementById('formCategoria');

        form.querySelectorAll('input[required]').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Abre modal para crear nueva categoría
     */
    function openCreateModal() {
        isEditing = false;
        resetForm();
        document.getElementById('modalTitle').textContent = 'Agregar Categoría';
        document.getElementById('infoProductos').classList.add('d-none');
        categoriaModal.show();
    }

    /**
     * Abre modal para editar categoría
     */
    function openEditModal(id) {
        isEditing = true;
        resetForm();
        document.getElementById('modalTitle').textContent = 'Editar Categoría';

        fetch(ENDPOINTS.get(id))
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    populateForm(result.data);
                    // Mostrar información de productos si tiene
                    if (result.cantidadProductos > 0) {
                        document.getElementById('cantidadProductos').textContent = result.cantidadProductos;
                        document.getElementById('infoProductos').classList.remove('d-none');
                    }
                    categoriaModal.show();
                } else {
                    showNotification('Error', result.message, 'error');
                }
            })
            .catch(error => {
                showNotification('Error', 'Error al cargar la categoría', 'error');
                console.error('Error:', error);
            });
    }

    /**
     * Llena el formulario con datos de la categoría
     */
    function populateForm(categoria) {
        document.getElementById('id').value = categoria.id;
        document.getElementById('nombre').value = categoria.nombre || '';
        document.getElementById('descripcion').value = categoria.descripcion || '';
        document.getElementById('estado').value = categoria.estado || 'ACTIVO';
    }

    /**
     * Resetea el formulario
     */
    function resetForm() {
        document.getElementById('formCategoria').reset();
        document.getElementById('id').value = '';
        document.getElementById('estado').value = 'ACTIVO';

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
                    categoriaModal.hide();
                    showNotification('Éxito', result.message, 'success');
                    dataTable.ajax.reload();
                    cargarEstadisticas();
                } else {
                    showNotification('Error', result.message, 'error');
                }
            })
            .catch(error => {
                showNotification('Error', 'Error al guardar la categoría', 'error');
                console.error('Error:', error);
            });
    }

    /**
     * Obtiene los datos del formulario
     */
    function getFormData() {
        return {
            id: document.getElementById('id').value || null,
            nombre: document.getElementById('nombre').value,
            descripcion: document.getElementById('descripcion').value,
            estado: document.getElementById('estado').value
        };
    }

    /**
     * Maneja la búsqueda de categorías
     */
    function handleSearch() {
        const nombre = $('#filtroNombre').val().trim();

        let url;
        if (!nombre) {
            url = ENDPOINTS.list;
        } else {
            url = ENDPOINTS.buscar(nombre);
        }

        dataTable.ajax.url(url).load();
    }

    /**
     * Cambia el estado de una categoría
     */
    function cambiarEstadoCategoria(id, nuevoEstado) {
        const acciones = {
            'ACTIVO': 'activar',
            'INACTIVO': 'inactivar',
            'ELIMINADO': 'eliminar'
        };

        const accion = acciones[nuevoEstado];

        Swal.fire({
            title: `¿Está seguro?`,
            text: `¿Desea ${accion} esta categoría?`,
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
                            cargarEstadisticas();
                        } else {
                            showNotification('Error', result.message, 'error');
                        }
                    })
                    .catch(error => {
                        showNotification('Error', `Error al ${accion} la categoría`, 'error');
                        console.error('Error:', error);
                    });
            }
        });
    }

    /**
     * Elimina una categoría (cambia estado a ELIMINADO)
     */
    function eliminarCategoria(id) {
        cambiarEstadoCategoria(id, 'ELIMINADO');
    }

    /**
     * Carga las estadísticas
     */
    function cargarEstadisticas() {
        fetch(ENDPOINTS.estadisticas)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    $('#totalActivas').text(result.totalActivas);
                    $('#totalConProductos').text(result.totalConProductos);
                }
            })
            .catch(error => {
                console.error('Error al cargar estadísticas:', error);
            });
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
});