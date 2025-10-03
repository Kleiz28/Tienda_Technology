package com.example.tienda_technology.service.impl;

import com.example.tienda_technology.model.Slider;
import com.example.tienda_technology.repository.SliderRepository;
import org.springframework.beans.factory.annotation.Value;
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
import java.util.stream.Collectors;

@Service
public class SliderService {

    private final SliderRepository sliderRepository;

    @Value("${slider.upload-dir}")
    private String uploadDir;

    public SliderService(SliderRepository sliderRepository) {
        this.sliderRepository = sliderRepository;
    }

    @Transactional(readOnly = true)
    public List<Slider> listarSlidersActivos() {
        return sliderRepository.findByEstadoOrderByOrdenAsc(Slider.Estado.ACTIVO);
    }

    @Transactional(readOnly = true)
    public List<Slider> listarTodos() {
        return sliderRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Slider> obtenerLogo() {
        List<Slider> logos = sliderRepository.findByEsLogoAndEstado(true, Slider.Estado.ACTIVO);
        return logos.isEmpty() ? Optional.empty() : Optional.of(logos.get(0));
    }

    @Transactional
    public Slider guardarSlider(Slider slider, MultipartFile imagenFile) throws IOException {
        if (imagenFile != null && !imagenFile.isEmpty()) {
            String nombreImagen = guardarImagen(imagenFile);
            slider.setImagenUrl(nombreImagen); // Solo guardar el nombre del archivo
        }
        return sliderRepository.save(slider);
    }

    @Transactional(readOnly = true)
    public Optional<Slider> obtenerPorId(Long id) {
        return sliderRepository.findById(id);
    }

    @Transactional
    public void cambiarEstado(Long id, Slider.Estado estado) {
        sliderRepository.findById(id).ifPresent(slider -> {
            slider.setEstado(estado);
            sliderRepository.save(slider);
        });
    }

    @Transactional
    public void eliminarSlider(Long id) {
        sliderRepository.findById(id).ifPresent(slider -> {
            // Eliminar la imagen del sistema de archivos
            if (slider.getImagenUrl() != null && !slider.getImagenUrl().isEmpty()) {
                eliminarImagen(slider.getImagenUrl());
            }
            sliderRepository.deleteById(id);
        });
    }

    /**
     * Guarda la imagen en el servidor
     */
    private String guardarImagen(MultipartFile imagenFile) throws IOException {
        String nombreUnico = UUID.randomUUID().toString() + "_" + imagenFile.getOriginalFilename();
        Path rutaCompleta = Paths.get(uploadDir + nombreUnico);

        // Crear directorio si no existe
        Files.createDirectories(rutaCompleta.getParent());

        // Guardar archivo
        Files.write(rutaCompleta, imagenFile.getBytes());
        return nombreUnico;
    }

    /**
     * Elimina una imagen del sistema de archivos
     */
    private void eliminarImagen(String nombreImagen) {
        if (nombreImagen == null || nombreImagen.isEmpty()) {
            return;
        }
        try {
            Path rutaImagen = Paths.get(uploadDir + nombreImagen);
            if (Files.exists(rutaImagen)) {
                Files.delete(rutaImagen);
                System.out.println("Imagen de slider eliminada: " + nombreImagen);
            }
        } catch (IOException e) {
            System.err.println("Error al eliminar la imagen del slider: " + nombreImagen + " - " + e.getMessage());
        }
    }

    /**
     * Limpia imágenes huérfanas
     */
    @Transactional
    public void limpiarImagenesHuerfanas() {
        try {
            Path directorioImagenes = Paths.get(uploadDir);
            if (!Files.exists(directorioImagenes)) {
                return;
            }

            // Obtener lista de imágenes en uso
            List<String> imagenesEnUso = sliderRepository.findAll()
                    .stream()
                    .map(Slider::getImagenUrl)
                    .filter(imagenUrl -> imagenUrl != null && !imagenUrl.isEmpty())
                    .collect(Collectors.toList());

            // Listar archivos en el directorio
            Files.list(directorioImagenes)
                    .filter(Files::isRegularFile)
                    .forEach(archivo -> {
                        String nombreArchivo = archivo.getFileName().toString();
                        if (!imagenesEnUso.contains(nombreArchivo)) {
                            try {
                                Files.delete(archivo);
                                System.out.println("Imagen huérfana de slider eliminada: " + nombreArchivo);
                            } catch (IOException e) {
                                System.err.println("Error eliminando imagen huérfana de slider: " + nombreArchivo);
                            }
                        }
                    });
        } catch (IOException e) {
            System.err.println("Error limpiando imágenes huérfanas de sliders: " + e.getMessage());
        }
    }
}