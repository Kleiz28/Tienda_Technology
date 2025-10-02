package com.example.tienda_technology.service;

import com.example.tienda_technology.model.ConfiguracionApp;
import com.example.tienda_technology.repository.ConfiguracionAppRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ConfiguracionAppService {

    private final ConfiguracionAppRepository configuracionAppRepository;

    public ConfiguracionAppService(ConfiguracionAppRepository configuracionAppRepository) {
        this.configuracionAppRepository = configuracionAppRepository;
        inicializarConfiguracionesPorDefecto();
    }

    @Transactional(readOnly = true)
    public List<ConfiguracionApp> listarTodas() {
        return configuracionAppRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<ConfiguracionApp> listarPorCategoria(String categoria) {
        return configuracionAppRepository.findByCategoria(categoria);
    }

    @Transactional(readOnly = true)
    public Optional<ConfiguracionApp> obtenerPorClave(String clave) {
        return configuracionAppRepository.findByClave(clave);
    }

    @Transactional(readOnly = true)
    public Map<String, String> obtenerConfiguracionesComoMapa() {
        List<ConfiguracionApp> configuraciones = listarTodas();
        Map<String, String> mapa = new HashMap<>();
        configuraciones.forEach(config -> mapa.put(config.getClave(), config.getValor()));
        return mapa;
    }

    @Transactional
    public ConfiguracionApp guardarConfiguracion(ConfiguracionApp configuracion) {
        return configuracionAppRepository.save(configuracion);
    }

    @Transactional
    public void guardarConfiguraciones(Map<String, String> configuraciones) {
        configuraciones.forEach((clave, valor) -> {
            configuracionAppRepository.findByClave(clave).ifPresent(config -> {
                config.setValor(valor);
                configuracionAppRepository.save(config);
            });
        });
    }

    private void inicializarConfiguracionesPorDefecto() {
        // Colores por defecto
        inicializarConfiguracion("COLOR_PRIMARIO", "#0d6efd", "Color primario de la aplicación", "COLORES");
        inicializarConfiguracion("COLOR_SECUNDARIO", "#6c757d", "Color secundario de la aplicación", "COLORES");
        inicializarConfiguracion("COLOR_NAVBAR", "#343a40", "Color de la barra de navegación", "COLORES");
        inicializarConfiguracion("COLOR_FOOTER", "#343a40", "Color del footer", "COLORES");
        inicializarConfiguracion("COLOR_BOTONES", "#0d6efd", "Color de los botones", "COLORES");

        // Redes sociales por defecto
        inicializarConfiguracion("FACEBOOK_URL", "", "URL de Facebook", "REDES_SOCIALES");
        inicializarConfiguracion("INSTAGRAM_URL", "", "URL de Instagram", "REDES_SOCIALES");
        inicializarConfiguracion("TWITTER_URL", "", "URL de Twitter", "REDES_SOCIALES");
        inicializarConfiguracion("WHATSAPP_NUMERO", "", "Número de WhatsApp", "REDES_SOCIALES");
    }

    private void inicializarConfiguracion(String clave, String valor, String descripcion, String categoria) {
        if (!configuracionAppRepository.existsByClave(clave)) {
            ConfiguracionApp config = new ConfiguracionApp();
            config.setClave(clave);
            config.setValor(valor);
            config.setDescripcion(descripcion);
            config.setCategoria(categoria);
            configuracionAppRepository.save(config);
        }
    }
}