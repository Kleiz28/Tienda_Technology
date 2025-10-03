package com.example.tienda_technology.repository;

import com.example.tienda_technology.model.Slider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SliderRepository extends JpaRepository<Slider, Long> {
    List<Slider> findByEstadoOrderByOrdenAsc(Slider.Estado estado);
    List<Slider> findByEsLogoAndEstado(Boolean esLogo, Slider.Estado estado);
    List<Slider> findByEsLogoFalseAndEstadoOrderByOrdenAsc(Slider.Estado estado);
}