package com.example.tienda_technology.service;

import com.example.tienda_technology.model.Producto;

import java.util.List;
import java.util.Optional;

public interface ProductoService {
    List<Producto> listarProductosActivos();

    List<Producto> listarTodosLosProductos();

    List<Producto> listarProductosConStockBajo();

    Producto guardarProducto(Producto producto);

    Optional<Producto> obtenerProductoPorId(Long id);

    Optional<Producto> cambiarEstadoProducto(Long id, Producto.Estado nuevoEstado);

    void eliminarProducto(Long id);

    List<Producto> buscarPorNombre(String nombre);

    List<Producto> buscarPorMarca(String marca);

    List<Producto> buscarPorCategoria(String categoria);

    boolean existeCodigoBarras(String codigoBarras, Long idExcluir);
}