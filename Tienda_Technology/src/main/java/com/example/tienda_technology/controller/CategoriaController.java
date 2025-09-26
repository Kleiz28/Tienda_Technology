package com.example.tienda_technology.controller;

import com.example.tienda_technology.dto.CategoriaDTO;
import com.example.tienda_technology.model.Categoria;
import com.example.tienda_technology.service.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    @GetMapping("/listar")
    public String mostrarPaginaCategorias() {
        return "GestionTienda/categorias";
    }

    @GetMapping("/api/listar")
    @ResponseBody
    public ResponseEntity<?> listarCategoriasApi() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Categoria> categorias = categoriaService.listarTodasLasCategorias();
            List<CategoriaDTO> categoriaDTOs = categorias.stream()
                    .map(CategoriaDTO::new)
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", categoriaDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar categorías: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/activas")
    @ResponseBody
    public ResponseEntity<?> listarCategoriasActivasApi() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Categoria> categorias = categoriaService.listarCategoriasActivas();
            List<CategoriaDTO> categoriaDTOs = categorias.stream()
                    .map(CategoriaDTO::new)
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", categoriaDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar categorías activas: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/con-productos")
    @ResponseBody
    public ResponseEntity<?> listarCategoriasConProductosApi() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Categoria> categorias = categoriaService.listarCategoriasConProductosActivos();
            List<CategoriaDTO> categoriaDTOs = categorias.stream()
                    .map(CategoriaDTO::new)
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", categoriaDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar categorías con productos: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<?> obtenerCategoria(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return categoriaService.obtenerCategoriaPorId(id)
                .map(categoria -> {
                    CategoriaDTO categoriaDTO = new CategoriaDTO(categoria);
                    response.put("success", true);
                    response.put("data", categoriaDTO);
                    response.put("puedeEliminarse", categoriaService.puedeEliminarse(id));
                    response.put("cantidadProductos", categoria.getCantidadProductosActivos());
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Categoría no encontrada");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                });
    }

    @PostMapping("/api/guardar")
    @ResponseBody
    public ResponseEntity<?> guardarCategoria(@RequestBody Categoria categoria) {
        Map<String, Object> response = new HashMap<>();
        try {
            Categoria categoriaGuardada = categoriaService.guardarCategoria(categoria);
            response.put("success", true);
            response.put("message", categoria.getId() != null ? "Categoría actualizada" : "Categoría creada");
            response.put("data", categoriaGuardada);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al guardar la categoría: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/cambiar-estado/{id}")
    @ResponseBody
    public ResponseEntity<?> cambiarEstadoCategoria(@PathVariable Long id, @RequestParam Categoria.Estado estado) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Validar si se puede inactivar/eliminar (tiene productos activos)
            if ((estado == Categoria.Estado.INACTIVO || estado == Categoria.Estado.ELIMINADO) &&
                    !categoriaService.puedeEliminarse(id)) {
                response.put("success", false);
                response.put("message", "No se puede inactivar/eliminar la categoría porque tiene productos activos asociados");
                return ResponseEntity.badRequest().body(response);
            }

            return categoriaService.cambiarEstadoCategoria(id, estado)
                    .map(categoria -> {
                        response.put("success", true);
                        response.put("message", "Estado de la categoría actualizado a " + estado);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        response.put("success", false);
                        response.put("message", "Categoría no encontrada");
                        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                    });
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al cambiar estado: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/api/eliminar/{id}")
    @ResponseBody
    public ResponseEntity<?> eliminarCategoria(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Validar si puede eliminarse
            if (!categoriaService.puedeEliminarse(id)) {
                response.put("success", false);
                response.put("message", "No se puede eliminar la categoría porque tiene productos activos asociados");
                return ResponseEntity.badRequest().body(response);
            }

            categoriaService.eliminarCategoria(id);
            response.put("success", true);
            response.put("message", "Categoría eliminada correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al eliminar la categoría: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/buscar")
    @ResponseBody
    public ResponseEntity<?> buscarCategorias(@RequestParam String nombre) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Categoria> categorias = categoriaService.buscarPorNombre(nombre);
            List<CategoriaDTO> categoriaDTOs = categorias.stream()
                    .map(CategoriaDTO::new)
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", categoriaDTOs);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error en la búsqueda: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/estadisticas")
    @ResponseBody
    public ResponseEntity<?> obtenerEstadisticas() {
        Map<String, Object> response = new HashMap<>();
        try {
            long totalActivas = categoriaService.contarCategoriasActivas();
            long totalConProductos = categoriaService.listarCategoriasConProductosActivos().size();

            response.put("success", true);
            response.put("totalActivas", totalActivas);
            response.put("totalConProductos", totalConProductos);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al obtener estadísticas: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/tienda/activas")
    @ResponseBody
    public ResponseEntity<?> listarCategoriasParaTienda() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Categoria> categorias = categoriaService.listarCategoriasActivas();

            List<Map<String, Object>> categoriasTienda = categorias.stream()
                    .map(categoria -> {
                        Map<String, Object> catMap = new HashMap<>();
                        catMap.put("id", categoria.getId());
                        catMap.put("nombre", categoria.getNombre());
                        catMap.put("valor", categoria.getNombre().toLowerCase()
                                .replace(" ", "-")
                                .replace("á", "a")
                                .replace("é", "e")
                                .replace("í", "i")
                                .replace("ó", "o")
                                .replace("ú", "u"));
                        return catMap;
                    })
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", categoriasTienda);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al cargar categorías: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}