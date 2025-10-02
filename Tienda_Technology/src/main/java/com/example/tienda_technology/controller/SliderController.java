package com.example.tienda_technology.controller;

import com.example.tienda_technology.model.Slider;
import com.example.tienda_technology.service.SliderService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/sliders")
public class SliderController {

    private final SliderService sliderService;

    public SliderController(SliderService sliderService) {
        this.sliderService = sliderService;
    }

    @GetMapping("/listar")
    public String mostrarPaginaSliders() {
        return "GestionTienda/sliders";
    }

    @GetMapping("/api/listar")
    @ResponseBody
    public ResponseEntity<?> listarSlidersApi() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Slider> sliders = sliderService.listarTodos();
            response.put("success", true);
            response.put("data", sliders);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar sliders");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/api/guardar")
    @ResponseBody
    public ResponseEntity<?> guardarSlider(
            @RequestParam("titulo") String titulo,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("esLogo") Boolean esLogo,
            @RequestParam("orden") Integer orden,
            @RequestParam("activo") Boolean activo,
            @RequestParam(value = "imagenFile", required = false) MultipartFile imagenFile,
            @RequestParam(value = "id", required = false) Long id) {

        Map<String, Object> response = new HashMap<>();
        try {
            Slider slider = new Slider();
            if (id != null) {
                slider.setId(id);
            }
            slider.setTitulo(titulo);
            slider.setDescripcion(descripcion);
            slider.setEsLogo(esLogo);
            slider.setOrden(orden);
            slider.setActivo(activo);

            Slider sliderGuardado = sliderService.guardarSlider(slider, imagenFile);
            response.put("success", true);
            response.put("message", id != null ? "Slider actualizado" : "Slider creado");
            response.put("data", sliderGuardado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al guardar slider: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/cambiar-estado/{id}")
    @ResponseBody
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam Boolean activo) {
        Map<String, Object> response = new HashMap<>();
        try {
            sliderService.cambiarEstado(id, activo);
            response.put("success", true);
            response.put("message", "Estado actualizado");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al cambiar estado");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/api/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<?> eliminarSlider(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            sliderService.eliminarSlider(id);
            response.put("success", true);
            response.put("message", "Slider eliminado");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al eliminar slider");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}