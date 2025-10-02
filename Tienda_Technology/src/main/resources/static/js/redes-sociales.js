$(document).ready(function() {
    const API_BASE = '/redes-sociales/api';
    const ICONOS = {
        'FACEBOOK_URL': 'bi-facebook',
        'INSTAGRAM_URL': 'bi-instagram',
        'TWITTER_URL': 'bi-twitter',
        'WHATSAPP_NUMERO': 'bi-whatsapp'
    };
    const COLORES = {
        'FACEBOOK_URL': 'text-primary',
        'INSTAGRAM_URL': 'text-warning',
        'TWITTER_URL': 'text-info',
        'WHATSAPP_NUMERO': 'text-success'
    };

    // Inicializar
    cargarRedesSociales();
    setupEventListeners();

    function cargarRedesSociales() {
        fetch(`${API_BASE}/listar`)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    renderizarRedesSociales(result.data);
                    actualizarVistaPrevia(result.data);
                } else {
                    showNotification('Error al cargar redes sociales', 'error');
                }
            })
            .catch(error => {
                showNotification('Error de conexión', 'error');
            });
    }

    function renderizarRedesSociales(redes) {
        const container = $('#redes-container');
        container.empty();

        redes.forEach(red => {
            const nombre = obtenerNombreRed(red.clave);
            const redCard = `
                <div class="row mb-3 align-items-center config-card p-3 border rounded">
                    <div class="col-md-3">
                        <div class="d-flex align-items-center">
                            <i class="bi ${ICONOS[red.clave]} ${COLORES[red.clave]} me-2" style="font-size: 1.5rem;"></i>
                            <span class="fw-semibold">${nombre}</span>
                        </div>
                    </div>
                    <div class="col-md-7">
                        <input type="url" 
                               class="form-control" 
                               id="${red.clave}" 
                               value="${red.valor}"
                               placeholder="https://..."
                               pattern="https?://.+">
                        <div class="form-text">${red.descripcion}</div>
                    </div>
                    <div class="col-md-2">
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" 
                                   ${red.valor ? 'checked' : ''}
                                   id="toggle-${red.clave}">
                            <label class="form-check-label" for="toggle-${red.clave}">
                                Activo
                            </label>
                        </div>
                    </div>
                </div>
            `;
            container.append(redCard);
        });

        configurarEventListenersRedes();
    }

    function configurarEventListenersRedes() {
        $('.form-check-input').on('change', function() {
            const redId = this.id.replace('toggle-', '');
            const input = $('#' + redId);
            if (!this.checked) {
                input.val('');
            }
            actualizarVistaPreviaEnTiempoReal();
        });

        $('input[type="url"]').on('input', function() {
            const toggle = $('#toggle-' + this.id);
            if (this.value) {
                toggle.prop('checked', true);
            }
            actualizarVistaPreviaEnTiempoReal();
        });
    }

    function actualizarVistaPreviaEnTiempoReal() {
        const redesActualizadas = [];
        $('.config-card').each(function() {
            const clave = $(this).find('input[type="url"]').attr('id');
            const valor = $(this).find('input[type="url"]').val();
            const activo = $(this).find('.form-check-input').is(':checked');

            redesActualizadas.push({
                clave,
                valor: activo ? valor : '',
                descripcion: obtenerNombreRed(clave)
            });
        });
        actualizarVistaPrevia(redesActualizadas);
    }

    function actualizarVistaPrevia(redes) {
        const preview = $('#redes-preview');
        preview.empty();

        redes.forEach(red => {
            if (red.valor) {
                const link = `
                    <a href="${red.valor}" 
                       class="text-decoration-none ${COLORES[red.clave]} me-3" 
                       target="_blank"
                       style="font-size: 1.5rem;">
                        <i class="bi ${ICONOS[red.clave]}"></i>
                    </a>
                `;
                preview.append(link);
            }
        });

        if (preview.children().length === 0) {
            preview.html('<small class="text-muted">No hay redes sociales configuradas</small>');
        }
    }

    function obtenerNombreRed(clave) {
        const nombres = {
            'FACEBOOK_URL': 'Facebook',
            'INSTAGRAM_URL': 'Instagram',
            'TWITTER_URL': 'Twitter',
            'WHATSAPP_NUMERO': 'WhatsApp'
        };
        return nombres[clave] || clave;
    }

    function setupEventListeners() {
        $('#formRedesSociales').submit(function(e) {
            e.preventDefault();
            guardarRedesSociales();
        });
    }

    function guardarRedesSociales() {
        const redes = {};
        $('.config-card').each(function() {
            const clave = $(this).find('input[type="url"]').attr('id');
            const valor = $(this).find('input[type="url"]').val();
            const activo = $(this).find('.form-check-input').is(':checked');

            redes[clave] = activo ? valor : '';
        });

        fetch(`${API_BASE}/guardar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(redes)
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