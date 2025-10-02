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
@RequestMapping("/redes-sociales")
public class RedesSocialesController {

    private final ConfiguracionAppService configuracionAppService;

    public RedesSocialesController(ConfiguracionAppService configuracionAppService) {
        this.configuracionAppService = configuracionAppService;
    }

    @GetMapping("/listar")
    public String mostrarPaginaRedesSociales() {
        return "GestionTienda/redes-sociales";
    }

    @GetMapping("/api/listar")
    @ResponseBody
    public ResponseEntity<?> obtenerRedesSociales() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<ConfiguracionApp> redes = configuracionAppService.listarPorCategoria("REDES_SOCIALES");
            response.put("success", true);
            response.put("data", redes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener redes sociales");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/api/guardar")
    @ResponseBody
    public ResponseEntity<?> guardarRedesSociales(@RequestBody Map<String, String> redes) {
        Map<String, Object> response = new HashMap<>();
        try {
            configuracionAppService.guardarConfiguraciones(redes);
            response.put("success", true);
            response.put("message", "Redes sociales guardadas correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al guardar redes sociales");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}