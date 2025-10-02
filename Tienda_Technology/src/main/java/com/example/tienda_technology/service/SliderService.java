package com.example.tienda_technology.service;

import com.example.tienda_technology.model.Slider;
import com.example.tienda_technology.repository.SliderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SliderService {

    private final SliderRepository sliderRepository;
    private final String uploadDir = "uploads/sliders/";

    public SliderService(SliderRepository sliderRepository) {
        this.sliderRepository = sliderRepository;
    }

    @Transactional(readOnly = true)
    public List<Slider> listarSlidersActivos() {
        return sliderRepository.findByActivoTrueOrderByOrdenAsc();
    }

    @Transactional(readOnly = true)
    public List<Slider> listarTodos() {
        return sliderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Slider> obtenerLogo() {
        List<Slider> logos = sliderRepository.findByEsLogoAndActivoTrue(true);
        return logos.isEmpty() ? Optional.empty() : Optional.of(logos.get(0));
    }

    @Transactional
    public Slider guardarSlider(Slider slider, MultipartFile imagenFile) throws IOException {
        if (imagenFile != null && !imagenFile.isEmpty()) {
            String nombreImagen = guardarImagen(imagenFile);
            slider.setImagenUrl("/" + uploadDir + nombreImagen);
        }
        return sliderRepository.save(slider);
    }

    @Transactional(readOnly = true)
    public Optional<Slider> obtenerPorId(Long id) {
        return sliderRepository.findById(id);
    }

    @Transactional
    public void cambiarEstado(Long id, Boolean activo) {
        sliderRepository.findById(id).ifPresent(slider -> {
            slider.setActivo(activo);
            sliderRepository.save(slider);
        });
    }

    @Transactional
    public void eliminarSlider(Long id) {
        sliderRepository.deleteById(id);
    }

    private String guardarImagen(MultipartFile imagenFile) throws IOException {
        String nombreUnico = UUID.randomUUID().toString() + "_" + imagenFile.getOriginalFilename();
        Path rutaCompleta = Paths.get(uploadDir + nombreUnico);
        Files.createDirectories(rutaCompleta.getParent());
        Files.write(rutaCompleta, imagenFile.getBytes());
        return nombreUnico;
    }
}