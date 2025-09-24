package com.example.tienda_technology.repository;

import com.example.tienda_technology.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    // Buscar categorías por estado
    List<Categoria> findByEstado(Categoria.Estado estado);

    // Buscar categorías activas
    List<Categoria> findByEstadoOrderByNombreAsc(Categoria.Estado estado);

    // Buscar categoría por nombre (ignorando mayúsculas/minúsculas)
    Optional<Categoria> findByNombreIgnoreCase(String nombre);

    // Verificar si existe una categoría con el mismo nombre (excluyendo la actual)
    @Query("SELECT COUNT(c) > 0 FROM Categoria c WHERE LOWER(c.nombre) = LOWER(:nombre) AND c.id != :idExcluir")
    boolean existsByNombreAndIdNot(String nombre, Long idExcluir);

    // Verificar si existe una categoría con el mismo nombre
    boolean existsByNombreIgnoreCase(String nombre);

    // Buscar categorías que contengan el texto en el nombre (activas)
    List<Categoria> findByNombreContainingIgnoreCaseAndEstado(String nombre, Categoria.Estado estado);

    // Contar categorías por estado
    long countByEstado(Categoria.Estado estado);

    // Obtener categorías con productos activos
    @Query("SELECT c FROM Categoria c WHERE c.estado = 'ACTIVO' AND EXISTS (SELECT p FROM Producto p WHERE p.categoria = c AND p.estado = 'ACTIVO')")
    List<Categoria> findCategoriasConProductosActivos();
}
