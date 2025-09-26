package com.example.tienda_technology.repository;

import com.example.tienda_technology.model.Categoria;
import com.example.tienda_technology.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos activos
    List<Producto> findByEstado(Producto.Estado estado);

    // Buscar productos por nombre (ignorando mayúsculas/minúsculas)
    List<Producto> findByNombreContainingIgnoreCaseAndEstado(String nombre, Producto.Estado estado);

    // Buscar productos por marca
    List<Producto> findByMarcaContainingIgnoreCaseAndEstado(String marca, Producto.Estado estado);

    // Buscar productos por categoría (por ID de categoría)
    List<Producto> findByCategoriaIdAndEstado(Long categoriaId, Producto.Estado estado);

    // Buscar productos por nombre de categoría (consulta personalizada)
    @Query("SELECT p FROM Producto p WHERE p.categoria.nombre LIKE %:nombreCategoria% AND p.estado = :estado")
    List<Producto> findByCategoriaNombreContainingAndEstado(String nombreCategoria, Producto.Estado estado);

    // Buscar productos con stock bajo
    @Query("SELECT p FROM Producto p WHERE p.stockActual <= p.stockMinimo AND p.estado = 'ACTIVO'")
    List<Producto> findProductosConStockBajo();

    // Buscar producto por código de barras
    Optional<Producto> findByCodigoBarras(String codigoBarras);

    // Verificar si existe un producto con el mismo código de barras (excluyendo el actual)
    @Query("SELECT COUNT(p) > 0 FROM Producto p WHERE p.codigoBarras = :codigoBarras AND p.id != :id")
    boolean existsByCodigoBarrasAndIdNot(String codigoBarras, Long id);

    // Contar productos activos por categoría
    @Query("SELECT COUNT(p) FROM Producto p WHERE p.categoria.id = :categoriaId AND p.estado = 'ACTIVO'")
    long countByCategoriaIdAndEstadoActivo(Long categoriaId);

    // Buscar productos por categoría (entidad)
    List<Producto> findByCategoriaAndEstado(Categoria categoria, Producto.Estado estado);

    long countByEstado(Producto.Estado estado);
}