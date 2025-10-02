package com.example.tienda_technology.repository;

import com.example.tienda_technology.model.Slider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SliderRepository extends JpaRepository<Slider, Long> {
    List<Slider> findByActivoTrueOrderByOrdenAsc();
    List<Slider> findByEsLogoAndActivoTrue(Boolean esLogo);
    List<Slider> findByEsLogoFalseAndActivoTrueOrderByOrdenAsc();
}