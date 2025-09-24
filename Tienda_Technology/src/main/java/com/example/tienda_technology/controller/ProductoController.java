package com.example.tienda_technology.controller;

import com.example.tienda_technology.model.Producto;
import com.example.tienda_technology.service.ProductoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/productos")
public class ProductoController {

    private final ProductoService productoService;

    public ProductoController(ProductoService productoService) {
        this.productoService = productoService;
    }

    @GetMapping("/listar")
    public String mostrarPaginaProductos() {
        return "GestionTienda/productos";
    }

    @GetMapping("/api/listar")
    @ResponseBody
    public ResponseEntity<?> listarProductosApi() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("data", productoService.listarTodosLosProductos());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar productos: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/activos")
    @ResponseBody
    public ResponseEntity<?> listarProductosActivosApi() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("data", productoService.listarProductosActivos());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar productos activos: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/stock-bajo")
    @ResponseBody
    public ResponseEntity<?> listarProductosStockBajoApi() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("data", productoService.listarProductosConStockBajo());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al listar productos con stock bajo: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/{id}")
    @ResponseBody
    public ResponseEntity<?> obtenerProducto(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        return productoService.obtenerProductoPorId(id)
                .map(producto -> {
                    response.put("success", true);
                    response.put("data", producto);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Producto no encontrado");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
                });
    }

    @PostMapping("/api/guardar")
    @ResponseBody
    public ResponseEntity<?> guardarProducto(@RequestBody Producto producto) {
        Map<String, Object> response = new HashMap<>();
        try {
            Producto productoGuardado = productoService.guardarProducto(producto);
            response.put("success", true);
            response.put("message", producto.getId() != null ? "Producto actualizado" : "Producto creado");
            response.put("data", productoGuardado);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al guardar el producto: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/api/cambiar-estado/{id}")
    @ResponseBody
    public ResponseEntity<?> cambiarEstadoProducto(@PathVariable Long id, @RequestParam Producto.Estado estado) {
        Map<String, Object> response = new HashMap<>();
        try {
            return productoService.cambiarEstadoProducto(id, estado)
                    .map(producto -> {
                        response.put("success", true);
                        response.put("message", "Estado del producto actualizado a " + estado);
                        return ResponseEntity.ok(response);
                    })
                    .orElseGet(() -> {
                        response.put("success", false);
                        response.put("message", "Producto no encontrado");
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
    public ResponseEntity<?> eliminarProducto(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            productoService.eliminarProducto(id);
            response.put("success", true);
            response.put("message", "Producto eliminado correctamente");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al eliminar el producto: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @GetMapping("/api/buscar")
    @ResponseBody
    public ResponseEntity<?> buscarProductos(@RequestParam String tipo, @RequestParam String valor) {
        Map<String, Object> response = new HashMap<>();
        try {
            switch (tipo.toUpperCase()) {
                case "NOMBRE":
                    response.put("data", productoService.buscarPorNombre(valor));
                    break;
                case "MARCA":
                    response.put("data", productoService.buscarPorMarca(valor));
                    break;
                case "CATEGORIA":
                    response.put("data", productoService.buscarPorCategoria(valor));
                    break;
                default:
                    response.put("data", productoService.listarProductosActivos());
            }
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error en la búsqueda: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}