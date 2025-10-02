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
        cambiarEstado: (id, activo) => `${API_BASE}/cambiar-estado/${id}?activo=${activo}`
    };

    function initializeDataTable() {
        dataTable = $('#tablaSliders').DataTable({
            responsive: true,
            processing: true,
            ajax: {
                url: ENDPOINTS.list,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: 'imagenUrl',
                    render: (data) => data ?
                        `<img src="${data}" class="img-slider" alt="Slider" style="height: 50px; object-fit: cover;">` :
                        '<div class="bg-light p-2 text-center">Sin imagen</div>'
                },
                { data: 'titulo' },
                {
                    data: 'esLogo',
                    render: (data) => data ?
                        '<span class="badge text-bg-primary">Logo</span>' :
                        '<span class="badge text-bg-secondary">Carrusel</span>'
                },
                { data: 'orden' },
                {
                    data: 'activo',
                    render: (data) => data ?
                        '<span class="badge text-bg-success">Activo</span>' :
                        '<span class="badge text-bg-danger">Inactivo</span>'
                },
                {
                    data: null,
                    orderable: false,
                    render: (data) => createActionButtons(data)
                }
            ],
            language: { url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json" }
        });
    }

    function createActionButtons(row) {
        const estadoBoton = row.activo ?
            '<button class="btn btn-sm btn-warning action-status" title="Desactivar">Desactivar</button>' :
            '<button class="btn btn-sm btn-success action-status" title="Activar">Activar</button>';

        return `
            <div class="d-flex gap-1">
                <button class="btn btn-sm btn-primary action-edit" data-id="${row.id}">Editar</button>
                ${estadoBoton}
                <button class="btn btn-sm btn-danger action-delete" data-id="${row.id}">Eliminar</button>
            </div>
        `;
    }

    function setupEventListeners() {
        $('#btnNuevoRegistro').click(openCreateModal);
        $('#formSlider').submit(handleFormSubmit);

        $('#tablaSliders tbody').on('click', '.action-edit', handleEdit);
        $('#tablaSliders tbody').on('click', '.action-status', handleToggleStatus);
        $('#tablaSliders tbody').on('click', '.action-delete', handleDelete);

        $('#imagenFile').change(function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('#imagenPreview').attr('src', e.target.result).show();
                }
                reader.readAsDataURL(file);
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
        const id = $(this).data('id');
        fetch(ENDPOINTS.get(id))
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    isEditing = true;
                    populateForm(result.data);
                    $('#modalTitle').text('Editar Slider');
                    sliderModal.show();
                } else {
                    showNotification('Error al cargar slider', 'error');
                }
            })
            .catch(error => {
                showNotification('Error de conexión', 'error');
            });
    }

    function populateForm(slider) {
        $('#id').val(slider.id);
        $('#titulo').val(slider.titulo);
        $('#descripcion').val(slider.descripcion);
        $('#esLogo').val(slider.esLogo.toString());
        $('#orden').val(slider.orden);
        $('#activo').val(slider.activo.toString());

        if (slider.imagenUrl) {
            $('#imagenPreview').attr('src', slider.imagenUrl).show();
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('id', $('#id').val());
        formData.append('titulo', $('#titulo').val());
        formData.append('descripcion', $('#descripcion').val());
        formData.append('esLogo', $('#esLogo').val());
        formData.append('orden', $('#orden').val());
        formData.append('activo', $('#activo').val());

        const imagenFile = $('#imagenFile')[0].files[0];
        if (imagenFile) {
            formData.append('imagenFile', imagenFile);
        }

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
                showNotification('Error de conexión', 'error');
            });
    }

    function handleToggleStatus(e) {
        const id = $(this).data('id');
        const activo = !$(this).closest('tr').find('.badge').text().includes('Activo');

        fetch(ENDPOINTS.cambiarEstado(id, activo), {
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
                showNotification('Error de conexión', 'error');
            });
    }

    function handleDelete(e) {
        const id = $(this).data('id');

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
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
                        showNotification('Error de conexión', 'error');
                    });
            }
        });
    }

    function resetForm() {
        $('#formSlider')[0].reset();
        $('#imagenPreview').hide();
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
        const toast = new bootstrap.Toast($('#notification-container .toast').last()[0], { delay: 4000 });
        toast.show();
    }

    // Inicialización
    initializeDataTable();
    sliderModal = new bootstrap.Modal(document.getElementById('sliderModal'));
    setupEventListeners();
});