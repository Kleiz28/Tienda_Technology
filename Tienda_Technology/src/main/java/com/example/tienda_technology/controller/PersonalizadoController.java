package com.example.tienda_technology.controller;

import com.example.tienda_technology.model.ConfiguracionApp;
import com.example.tienda_technology.service.ConfiguracionAppService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/personalizado")
public class PersonalizadoController {

    private final ConfiguracionAppService configuracionAppService;

    public PersonalizadoController(ConfiguracionAppService configuracionAppService) {
        this.configuracionAppService = configuracionAppService;
    }

    @GetMapping("/listar")
    public String mostrarPaginaPersonalizado() {
        return "GestionTienda/personalizado";
    }

    @GetMapping("/api/colores")
    @ResponseBody
    public ResponseEntity<?> obtenerColores() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ConfiguracionApp> colores = configuracionAppService.listarPorCategoria("COLORES");
            response.put("success", true);
            response.put("data", colores);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener colores");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/api/guardar-colores")
    @ResponseBody
    public ResponseEntity<?> guardarColores(@RequestBody Map<String, String> colores) {
        Map<String, Object> response = new HashMap<>();
        try {
            configuracionAppService.guardarConfiguraciones(colores);
            response.put("success", true);
            response.put("message", "Colores guardados correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al guardar colores");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/tienda/configuraciones")
    @ResponseBody
    public ResponseEntity<?> obtenerConfiguracionesTienda() {
        Map<String, Object> response = new HashMap<>();
        try {
            Map<String, String> configuraciones = configuracionAppService.obtenerConfiguracionesComoMapa();
            response.put("success", true);
            response.put("data", configuraciones);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener configuraciones");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}