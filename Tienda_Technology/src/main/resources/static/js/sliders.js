$(document).ready(function() {
    let dataTable;
    let isEditing = false;
    let sliderModal;

    const API_BASE = '/sliders/api';
    const ENDPOINTS = {
        list: `${API_BASE}/listar`,
        save: `${API_BASE}/guardar`,
        get: (id) => `${API_BASE}/${id}`,
        delete: (id) => `${API_BASE}/eliminar/${id}`,
        cambiarEstado: (id) => `${API_BASE}/cambiar-estado/${id}`
    };

    function initializeDataTable() {
        dataTable = $('#tablaSliders').DataTable({
            responsive: true,
            processing: true,
            serverSide: false,
            ajax: {
                url: ENDPOINTS.list,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: 'imagenUrl',
                    render: function(data, type, row) {
                        if (data) {
                            // Usar el método helper para obtener la URL completa
                            const imagenUrlCompleta = row.imagenUrlCompleta || `/sliders/${data}`;
                            return `<img src="${imagenUrlCompleta}" class="img-slider" alt="Slider" style="height: 50px; width: 80px; object-fit: cover; border-radius: 4px;">`;
                        } else {
                            return '<div class="bg-light p-2 text-center" style="height: 50px; width: 80px; display: flex; align-items: center; justify-content: center; border-radius: 4px;">Sin imagen</div>';
                        }
                    }
                },
                {
                    data: 'titulo',
                    render: function(data) {
                        return data || 'Sin título';
                    }
                },
                {
                    data: 'esLogo',
                    render: function(data) {
                        return data ?
                            '<span class="badge text-bg-primary">Logo</span>' :
                            '<span class="badge text-bg-secondary">Carrusel</span>';
                    }
                },
                {
                    data: 'orden',
                    render: function(data) {
                        return data || 1;
                    }
                },
                {
                    data: 'estado',
                    render: function(data) {
                        if (data === 'ACTIVO') {
                            return '<span class="badge text-bg-success">Activo</span>';
                        } else if (data === 'INACTIVO') {
                            return '<span class="badge text-bg-danger">Inactivo</span>';
                        } else {
                            return '<span class="badge text-bg-secondary">' + data + '</span>';
                        }
                    }
                },
                {
                    data: null,
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row) {
                        return createActionButtons(row);
                    }
                }
            ],
            language: {
                url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
            },
            pageLength: 10,
            order: [[3, 'asc']] // Ordenar por orden ascendente por defecto
        });
    }

    function createActionButtons(row) {
        const estadoBoton = row.estado === 'ACTIVO' ?
            '<button class="btn btn-sm btn-warning action-status" data-id="' + row.id + '" title="Desactivar">Desactivar</button>' :
            '<button class="btn btn-sm btn-success action-status" data-id="' + row.id + '" title="Activar">Activar</button>';

        return `
            <div class="d-flex gap-1 flex-wrap">
                <button class="btn btn-sm btn-primary action-edit" data-id="${row.id}">Editar</button>
                ${estadoBoton}
                <button class="btn btn-sm btn-danger action-delete" data-id="${row.id}">Eliminar</button>
            </div>
        `;
    }

    function setupEventListeners() {
        $('#btnNuevoRegistro').click(openCreateModal);
        $('#formSlider').submit(handleFormSubmit);

        // Usar event delegation para los botones dinámicos
        $('#tablaSliders').on('click', '.action-edit', handleEdit);
        $('#tablaSliders').on('click', '.action-status', handleToggleStatus);
        $('#tablaSliders').on('click', '.action-delete', handleDelete);

        $('#imagenFile').change(function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#imagenPreview').attr('src', e.target.result).show();
                }
                reader.readAsDataURL(file);
            } else {
                $('#imagenPreview').hide();
            }
        });
    }

    function openCreateModal() {
        isEditing = false;
        resetForm();
        $('#modalTitle').text('Agregar Slider');
        sliderModal.show();
    }

    function handleEdit(e) {
        e.preventDefault();
        const id = $(this).data('id');

        showLoading(true);

        fetch(`/sliders/api/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar slider');
                }
                return response.json();
            })
            .then(result => {
                if (result.success) {
                    isEditing = true;
                    populateForm(result.data);
                    $('#modalTitle').text('Editar Slider');
                    sliderModal.show();
                } else {
                    showNotification('Error al cargar slider: ' + (result.message || ''), 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error de conexión al cargar slider', 'error');
            })
            .finally(() => {
                showLoading(false);
            });
    }

    function populateForm(slider) {
        $('#id').val(slider.id);
        $('#titulo').val(slider.titulo);
        $('#descripcion').val(slider.descripcion || '');
        $('#esLogo').val(slider.esLogo.toString());
        $('#orden').val(slider.orden);
        $('#estado').val(slider.estado.toString());

        // Mostrar imagen actual si existe
        if (slider.imagenUrl) {
            const imagenUrlCompleta = slider.imagenUrlCompleta || `/sliders/${slider.imagenUrl}`;
            $('#imagenPreview').attr('src', imagenUrlCompleta).show();
        } else {
            $('#imagenPreview').hide();
        }

        // Limpiar el input de archivo
        $('#imagenFile').val('');
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        // Validación básica
        if (!validateForm()) {
            return;
        }

        const formData = new FormData();
        formData.append('id', $('#id').val());
        formData.append('titulo', $('#titulo').val().trim());
        formData.append('descripcion', $('#descripcion').val().trim());
        formData.append('esLogo', $('#esLogo').val());
        formData.append('orden', $('#orden').val());
        formData.append('activo', $('#estado').val() === 'true' ? 'ACTIVO' : 'INACTIVO');

        const imagenFile = $('#imagenFile')[0].files[0];
        if (imagenFile) {
            formData.append('imagenFile', imagenFile);
        }

        showLoading(true);

        fetch(ENDPOINTS.save, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    sliderModal.hide();
                    showNotification(result.message, 'success');
                    dataTable.ajax.reload();
                } else {
                    showNotification(result.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error de conexión al guardar slider', 'error');
            })
            .finally(() => {
                showLoading(false);
            });
    }

    function validateForm() {
        let isValid = true;

        // Limpiar errores previos
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').text('');

        // Validar título
        if (!$('#titulo').val().trim()) {
            $('#titulo').addClass('is-invalid');
            $('#titulo-error').text('El título es obligatorio');
            isValid = false;
        }

        // Validar orden
        const orden = $('#orden').val();
        if (!orden || orden < 1) {
            $('#orden').addClass('is-invalid');
            $('#orden-error').text('El orden debe ser un número mayor a 0');
            isValid = false;
        }

        return isValid;
    }

    function handleToggleStatus(e) {
        e.preventDefault();
        const id = $(this).data('id');
        const nuevoEstado = $(this).hasClass('btn-warning') ? 'INACTIVO' : 'ACTIVO';

        showLoading(true);

        fetch(`${ENDPOINTS.cambiarEstado(id)}?activo=${nuevoEstado}`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showNotification(result.message, 'success');
                    dataTable.ajax.reload();
                } else {
                    showNotification(result.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Error de conexión al cambiar estado', 'error');
            })
            .finally(() => {
                showLoading(false);
            });
    }

    function handleDelete(e) {
        e.preventDefault();
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                showLoading(true);

                fetch(ENDPOINTS.delete(id), {
                    method: 'DELETE'
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            showNotification(result.message, 'success');
                            dataTable.ajax.reload();
                        } else {
                            showNotification(result.message, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showNotification('Error de conexión al eliminar slider', 'error');
                    })
                    .finally(() => {
                        showLoading(false);
                    });
            }
        });
    }

    function resetForm() {
        $('#formSlider')[0].reset();
        $('#imagenPreview').hide();
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').text('');
        $('#id').val('');
    }

    function showNotification(message, type) {
        const toastClass = type === 'success' ? 'text-bg-success' : 'text-bg-danger';
        const toastHtml = `
            <div class="toast align-items-center ${toastClass} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        $('#notification-container').append(toastHtml);
        const toast = new bootstrap.Toast($('#notification-container .toast').last()[0], {
            delay: 4000
        });
        toast.show();

        // Remover el toast después de que se oculte
        setTimeout(() => {
            $('#notification-container .toast').first().remove();
        }, 4500);
    }

    function showLoading(show) {
        if (show) {
            if ($('#loading-overlay').length === 0) {
                $('body').append(`
                    <div id="loading-overlay" class="loading-overlay">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                `);
            }
        } else {
            $('#loading-overlay').remove();
        }
    }

    // Inicialización
    initializeDataTable();
    sliderModal = new bootstrap.Modal(document.getElementById('sliderModal'));
    setupEventListeners();

    console.log('Slider JS inicializado correctamente');
});