package com.example.tienda_technology.repository;

import com.example.tienda_technology.model.ConfiguracionApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConfiguracionAppRepository extends JpaRepository<ConfiguracionApp, Long> {
    Optional<ConfiguracionApp> findByClave(String clave);
    List<ConfiguracionApp> findByCategoria(String categoria);
    boolean existsByClave(String clave);
}