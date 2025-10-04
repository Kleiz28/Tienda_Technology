$(document).ready(function() {
    const API_BASE = '/personalizado/api';
    let configuraciones = {};

    // Inicializar
    cargarColores();
    setupEventListeners();

    function cargarColores() {
        fetch(`${API_BASE}/colores`)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    renderizarColores(result.data);
                    actualizarVistaPrevia(result.data);
                } else {
                    showNotification('Error al cargar colores', 'error');
                }
            })
            .catch(error => {
                showNotification('Error de conexión', 'error');
            });
    }

    function renderizarColores(colores) {
        const container = $('#colores-container');
        container.empty();

        colores.forEach(config => {
            const colorCard = `
                <div class="row mb-3 align-items-center config-card p-3 border rounded">
                    <div class="col-md-4">
                        <label class="form-label fw-semibold">${config.descripcion}</label>
                    </div>
                    <div class="col-md-6">
                        <div class="input-group">
                            <input type="color" 
                                   class="form-control form-control-color" 
                                   id="${config.clave}" 
                                   value="${config.valor}"
                                   title="Seleccionar color">
                            <input type="text" 
                                   class="form-control" 
                                   value="${config.valor}" 
                                   maxlength="7"
                                   pattern="^#[0-9A-Fa-f]{6}$">
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="color-preview" 
                             style="background-color: ${config.valor}"
                             data-bs-toggle="tooltip" 
                             title="Vista previa"></div>
                    </div>
                </div>
            `;
            container.append(colorCard);
        });

        // Inicializar tooltips
        $('[data-bs-toggle="tooltip"]').tooltip();

        // Configurar event listeners para los inputs
        configurarEventListenersColores();
    }

    function configurarEventListenersColores() {
        // Sincronizar color picker con input de texto
        $('input[type="color"]').on('input', function() {
            const textInput = $(this).next('input[type="text"]');
            textInput.val(this.value);
            actualizarVistaPreviaEnTiempoReal();
        });

        $('input[type="text"]').on('input', function() {
            const colorInput = $(this).prev('input[type="color"]');
            const value = this.value;
            if (isValidColor(value)) {
                colorInput.val(value);
                actualizarVistaPreviaEnTiempoReal();
            }
        });

        // Actualizar preview al hacer clic en el cuadro de color
        $('.color-preview').on('click', function() {
            const row = $(this).closest('.row');
            const colorInput = row.find('input[type="color"]');
            colorInput.trigger('click');
        });
    }

    function actualizarVistaPreviaEnTiempoReal() {
        const coloresActualizados = [];
        $('.config-card').each(function() {
            const clave = $(this).find('input[type="color"]').attr('id');
            const valor = $(this).find('input[type="color"]').val();
            const preview = $(this).find('.color-preview');

            preview.css('background-color', valor);
            coloresActualizados.push({ clave, valor });
        });
        actualizarVistaPrevia(coloresActualizados);
    }

    function actualizarVistaPrevia(colores) {
        // Actualizar variables CSS para la vista previa
        colores.forEach(config => {
            let cssVar = '';
            switch(config.clave) {
                case 'COLOR_NAVBAR':
                    cssVar = '--navbar-bg-color';
                    break;
                case 'COLOR_FOOTER':
                    cssVar = '--footer-bg-color';
                    break;
                case 'COLOR_BOTONES':
                    cssVar = '--button-color';
                    break;
                case 'COLOR_PRIMARIO':
                    cssVar = '--primary-accent';
                    break;
                case 'COLOR_SECUNDARIO':
                    cssVar = '--secondary-color';
                    break;
            }
            if (cssVar) {
                document.documentElement.style.setProperty(cssVar, config.valor);

                // Actualizar elementos específicos en la vista previa
                if (config.clave === 'COLOR_NAVBAR') {
                    document.querySelector('.preview-navbar').style.backgroundColor = config.valor;
                } else if (config.clave === 'COLOR_FOOTER') {
                    document.querySelector('.preview-footer').style.backgroundColor = config.valor;
                } else if (config.clave === 'COLOR_BOTONES') {
                    document.querySelector('.preview-button .btn').style.backgroundColor = config.valor;
                }
            }
        });
    }

    function setupEventListeners() {
        $('#formColores').submit(function(e) {
            e.preventDefault();
            guardarColores();
        });

        $('#btnReset').click(function() {
            Swal.fire({
                title: '¿Restablecer colores?',
                text: 'Se perderán los cambios no guardados',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, restablecer',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    cargarColores();
                    showNotification('Colores restablecidos', 'success');
                }
            });
        });
    }

    function guardarColores() {
        const colores = {};
        $('.config-card').each(function() {
            const clave = $(this).find('input[type="color"]').attr('id');
            const valor = $(this).find('input[type="color"]').val();
            colores[clave] = valor;
        });

        fetch(`${API_BASE}/guardar-colores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(colores)
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    showNotification(result.message, 'success');
                } else {
                    showNotification(result.message, 'error');
                }
            })
            .catch(error => {
                showNotification('Error de conexión', 'error');
            });
    }

    function isValidColor(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
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
});