package com.example.tienda_technology.controller;

import com.example.tienda_technology.model.Categoria;
import com.example.tienda_technology.model.Producto;
import com.example.tienda_technology.service.CategoriaService;
import com.example.tienda_technology.service.ProductoService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
public class TiendaVirtualController {

    private final CategoriaService categoriaService;
    private final ProductoService productoService;

    public TiendaVirtualController(CategoriaService categoriaService, ProductoService productoService) {
        this.categoriaService = categoriaService;
        this.productoService = productoService;
    }

    @GetMapping("/tienda")
    public String tiendaVirtual() {
        return "TiendaVirtual/index"; // Retorna tu página de ecommerce
    }


    @GetMapping("/")
    public String home() {
        return "redirect:/tienda"; // Redirige a la tienda virtual
    }

    // Endpoint público para categorías activas
    @GetMapping("/api/tienda/categorias")
    @ResponseBody
    public ResponseEntity<?> getCategoriasActivas() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Categoria> categorias = categoriaService.listarCategoriasActivas();

            List<Map<String, Object>> categoriasParaTienda = categorias.stream()
                    .map(categoria -> {
                        Map<String, Object> catMap = new HashMap<>();
                        catMap.put("id", categoria.getId());
                        catMap.put("nombre", categoria.getNombre());
                        catMap.put("valor", generarValorCategoria(categoria.getNombre()));
                        catMap.put("cantidadProductos", categoria.getCantidadProductosActivos());
                        return catMap;
                    })
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", categoriasParaTienda);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al cargar categorías: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Endpoint público para productos activos
    @GetMapping("/api/tienda/productos")
    @ResponseBody
    public ResponseEntity<?> getProductosActivos() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Producto> productos = productoService.listarProductosActivos();

            List<Map<String, Object>> productosParaTienda = productos.stream()
                    .map(producto -> {
                        Map<String, Object> prodMap = new HashMap<>();
                        prodMap.put("id", producto.getId());
                        prodMap.put("nombre", producto.getNombre());
                        prodMap.put("descripcion", producto.getDescripcion());
                        prodMap.put("precio", producto.getPrecioUnitario());
                        prodMap.put("imagen", producto.getFotoUrl());
                        prodMap.put("marca", producto.getMarca());
                        prodMap.put("stock", producto.getStockActual());

                        if (producto.getCategoria() != null) {
                            prodMap.put("categoria", producto.getCategoria().getNombre());
                            prodMap.put("categoriaValor", generarValorCategoria(producto.getCategoria().getNombre()));
                        }

                        return prodMap;
                    })
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", productosParaTienda);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al cargar productos: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // Endpoint público para productos por categoría
    @GetMapping("/api/tienda/categorias/{categoriaValor}/productos")
    @ResponseBody
    public ResponseEntity<?> getProductosPorCategoria(@PathVariable String categoriaValor) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Convertir el valor de la categoría a nombre
            String nombreCategoria = convertirValorANombre(categoriaValor);
            List<Producto> productos = productoService.buscarPorCategoria(nombreCategoria);

            List<Map<String, Object>> productosParaTienda = productos.stream()
                    .map(producto -> {
                        Map<String, Object> prodMap = new HashMap<>();
                        prodMap.put("id", producto.getId());
                        prodMap.put("nombre", producto.getNombre());
                        prodMap.put("descripcion", producto.getDescripcion());
                        prodMap.put("precio", producto.getPrecioUnitario());
                        prodMap.put("imagen", producto.getFotoUrl());
                        prodMap.put("marca", producto.getMarca());
                        return prodMap;
                    })
                    .collect(Collectors.toList());

            response.put("success", true);
            response.put("data", productosParaTienda);
            response.put("categoria", nombreCategoria);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error al cargar productos: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    private String generarValorCategoria(String nombre) {
        return nombre.toLowerCase()
                .replace(" ", "-")
                .replace("á", "a").replace("é", "e").replace("í", "i")
                .replace("ó", "o").replace("ú", "u")
                .replace("ñ", "n");
    }

    private String convertirValorANombre(String valor) {
        return valor.replace("-", " ")
                .replace("a", "á").replace("e", "é").replace("i", "í")
                .replace("o", "ó").replace("u", "ú")
                .replace("n", "ñ");
    }
}