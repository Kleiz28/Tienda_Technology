package com.example.tienda_technology.service.impl;

import com.example.tienda_technology.model.Categoria;
import com.example.tienda_technology.repository.CategoriaRepository;
import com.example.tienda_technology.repository.ProductoRepository;
import com.example.tienda_technology.service.CategoriaService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;

    public CategoriaServiceImpl(CategoriaRepository categoriaRepository,
                                ProductoRepository productoRepository) {
        this.categoriaRepository = categoriaRepository;
        this.productoRepository = productoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> listarCategoriasActivas() {
        return categoriaRepository.findByEstadoOrderByNombreAsc(Categoria.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> listarTodasLasCategorias() {
        return categoriaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> listarCategoriasConProductosActivos() {
        return categoriaRepository.findCategoriasConProductosActivos();
    }

    @Override
    @Transactional
    public Categoria guardarCategoria(Categoria categoria) {
        // Validar que el nombre sea único
        if (existeNombreCategoria(categoria.getNombre(), categoria.getId())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + categoria.getNombre());
        }

        // Si es nueva categoría, establecer estado ACTIVO por defecto
        if (categoria.getId() == null) {
            categoria.setEstado(Categoria.Estado.ACTIVO);
        }

        return categoriaRepository.save(categoria);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria> obtenerCategoriaPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Categoria> obtenerCategoriaPorNombre(String nombre) {
        return categoriaRepository.findByNombreIgnoreCase(nombre);
    }

    @Override
    @Transactional
    public Optional<Categoria> cambiarEstadoCategoria(Long id, Categoria.Estado nuevoEstado) {
        return categoriaRepository.findById(id).map(categoria -> {
            categoria.setEstado(nuevoEstado);
            return categoriaRepository.save(categoria);
        });
    }

    @Override
    @Transactional
    public void eliminarCategoria(Long id) {
        // En lugar de eliminar físicamente, cambiamos el estado a ELIMINADO
        cambiarEstadoCategoria(id, Categoria.Estado.ELIMINADO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Categoria> buscarPorNombre(String nombre) {
        return categoriaRepository.findByNombreContainingIgnoreCaseAndEstado(nombre, Categoria.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeNombreCategoria(String nombre, Long idExcluir) {
        if (idExcluir == null) {
            return categoriaRepository.existsByNombreIgnoreCase(nombre);
        }
        return categoriaRepository.existsByNombreAndIdNot(nombre, idExcluir);
    }

    @Override
    @Transactional(readOnly = true)
    public long contarCategoriasActivas() {
        return categoriaRepository.countByEstado(Categoria.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean puedeEliminarse(Long id) {
        // Verificar si la categoría tiene productos activos usando el método correcto
        long productosActivos = productoRepository.countByCategoriaIdAndEstadoActivo(id);
        return productosActivos == 0;
    }
}