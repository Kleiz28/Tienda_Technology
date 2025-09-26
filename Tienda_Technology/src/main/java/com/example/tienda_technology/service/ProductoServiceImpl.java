package com.example.tienda_technology.service;

import com.example.tienda_technology.model.Producto;
import com.example.tienda_technology.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;

    public ProductoServiceImpl(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarProductosActivos() {
        return productoRepository.findByEstado(Producto.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarTodosLosProductos() {
        return productoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> listarProductosConStockBajo() {
        return productoRepository.findProductosConStockBajo();
    }

    @Override
    @Transactional
    public Producto guardarProducto(Producto producto) {
        // Validar que el código de barras sea único (si se proporciona)
        if (producto.getCodigoBarras() != null && !producto.getCodigoBarras().trim().isEmpty()) {
            if (existeCodigoBarras(producto.getCodigoBarras(), producto.getId())) {
                throw new RuntimeException("Ya existe un producto con el código de barras: " + producto.getCodigoBarras());
            }
        }

        // Si es nuevo producto, establecer estado ACTIVO por defecto
        if (producto.getId() == null) {
            producto.setEstado(Producto.Estado.ACTIVO);
        }

        return productoRepository.save(producto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    @Transactional
    public Optional<Producto> cambiarEstadoProducto(Long id, Producto.Estado nuevoEstado) {
        return productoRepository.findById(id).map(producto -> {
            producto.setEstado(nuevoEstado);
            return productoRepository.save(producto);
        });
    }

    @Override
    @Transactional
    public void eliminarProducto(Long id) {
        // En lugar de eliminar físicamente, cambiamos el estado a ELIMINADO
        cambiarEstadoProducto(id, Producto.Estado.ELIMINADO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndEstado(nombre, Producto.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarPorMarca(String marca) {
        return productoRepository.findByMarcaContainingIgnoreCaseAndEstado(marca, Producto.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarPorCategoria(String categoria) {
        // Buscar por nombre de categoría
        return productoRepository.findByCategoriaNombreContainingAndEstado(categoria, Producto.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Producto> buscarPorCategoriaId(Long categoriaId) {
        return productoRepository.findByCategoriaIdAndEstado(categoriaId, Producto.Estado.ACTIVO);
    }

    @Override
    @Transactional(readOnly = true)
    public long contarProductosActivosPorCategoriaId(Long categoriaId) {
        return productoRepository.countByCategoriaIdAndEstadoActivo(categoriaId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existeCodigoBarras(String codigoBarras, Long idExcluir) {
        if (idExcluir == null) {
            return productoRepository.findByCodigoBarras(codigoBarras).isPresent();
        }
        return productoRepository.existsByCodigoBarrasAndIdNot(codigoBarras, idExcluir);
    }

    @Transactional(readOnly = true)
    public long contarProductos() {
        // Contamos solo los usuarios que no están eliminados lógicamente
        // Nota: Necesitarás crear este método en tu ProductoRepository.
        // Ejemplo: long countByEstadoNot(Integer estado);
        return productoRepository.countByEstado(Producto.Estado.ACTIVO);
    }
}