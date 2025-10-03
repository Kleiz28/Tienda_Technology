package com.example.tienda_technology.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
public class ImageController {

    @Value("${file.upload-dir}")
    private String fotosUploadDir;

    @Value("${slider.upload-dir}")
    private String slidersUploadDir;

    @GetMapping("/fotos/{filename:.+}")
    public ResponseEntity<Resource> serveFoto(@PathVariable String filename) {
        return serveFile(filename, fotosUploadDir);
    }

    @GetMapping("/sliders/{filename:.+}")
    public ResponseEntity<Resource> serveSlider(@PathVariable String filename) {
        return serveFile(filename, slidersUploadDir);
    }

    private ResponseEntity<Resource> serveFile(String filename, String uploadDir) {
        try {
            Path file = Paths.get(uploadDir).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}