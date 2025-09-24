package com.example.tienda_technology.service;

import com.example.tienda_technology.model.Categoria;

import java.util.List;
import java.util.Optional;

public interface CategoriaService {

    List<Categoria> listarCategoriasActivas();

    List<Categoria> listarTodasLasCategorias();

    List<Categoria> listarCategoriasConProductosActivos();

    Categoria guardarCategoria(Categoria categoria);

    Optional<Categoria> obtenerCategoriaPorId(Long id);

    Optional<Categoria> obtenerCategoriaPorNombre(String nombre);

    Optional<Categoria> cambiarEstadoCategoria(Long id, Categoria.Estado nuevoEstado);

    void eliminarCategoria(Long id);

    List<Categoria> buscarPorNombre(String nombre);

    boolean existeNombreCategoria(String nombre, Long idExcluir);

    long contarCategoriasActivas();

    boolean puedeEliminarse(Long id);
}