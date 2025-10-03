package com.example.tienda_technology.service;

import com.example.tienda_technology.model.Usuario;
import com.example.tienda_technology.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.Objects;
import java.util.stream.Collectors;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    @Value("${file.upload-dir}")
    private String uploadDir;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    @Transactional(readOnly = true)
    public List<Usuario> listarUsuarios() {
        // Excluimos a los usuarios con estado 2 (eliminados lógicamente)
        // Nota: Necesitarás crear este método en tu UsuarioRepository.
        // Ejemplo: List<Usuario> findAllByEstadoNot(Integer estado);
        return usuarioRepository.findAllByEstadoNot(2);
    }

    @Transactional
    public Usuario guardarUsuario(Usuario usuario, MultipartFile fotoFile, boolean eliminarFoto) throws IOException {
        try {
            // Validaciones adicionales
            if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
                throw new IllegalArgumentException("El nombre es obligatorio");
            }

            if (usuario.getUsuario() == null || usuario.getUsuario().trim().isEmpty()) {
                throw new IllegalArgumentException("El usuario es obligatorio");
            }

            if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
                throw new IllegalArgumentException("El correo es obligatorio");
            }

            // Normalizar datos
            usuario.setNombre(usuario.getNombre().trim());
            usuario.setUsuario(usuario.getUsuario().trim().toLowerCase());
            usuario.setCorreo(usuario.getCorreo().trim().toLowerCase());

            // Obtener usuario existente si es una actualización
            Usuario usuarioExistente = null;
            if (usuario.getId() != null) {
                usuarioExistente = obtenerUsuarioPorId(usuario.getId())
                        .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado para actualizar"));
            }

            if (usuarioExistente != null) {
                // Usuario existente - actualización
                if (usuario.getClave() == null || usuario.getClave().trim().isEmpty()) {
                    usuario.setClave(usuarioExistente.getClave());
                } else {
                    usuario.setClave(passwordEncoder.encode(usuario.getClave().trim()));
                }
            } else {
                // Nuevo usuario - la contraseña es obligatoria
                if (usuario.getClave() == null || usuario.getClave().trim().isEmpty()) {
                    throw new IllegalArgumentException("La contraseña es obligatoria para nuevos usuarios");
                }
                usuario.setClave(passwordEncoder.encode(usuario.getClave().trim()));
                usuario.setEstado(1);
            }

            // Manejo de la foto
            if (eliminarFoto) {
                // Eliminar foto existente si se solicita
                if (usuarioExistente != null && usuarioExistente.getFoto() != null) {
                    eliminarFoto(usuarioExistente.getFoto());
                }
                usuario.setFoto(null); // Establecer como null en la base de datos
            } else if (fotoFile != null && !fotoFile.isEmpty()) {
                // Subir nueva foto
                if (usuarioExistente != null && usuarioExistente.getFoto() != null) {
                    eliminarFoto(usuarioExistente.getFoto()); // Eliminar foto anterior
                }
                String nombreFoto = guardarFoto(fotoFile);
                usuario.setFoto(nombreFoto);
            } else if (usuarioExistente != null) {
                // Mantener foto existente si no se sube nueva ni se elimina
                usuario.setFoto(usuarioExistente.getFoto());
            }

            return usuarioRepository.save(usuario);

        } catch (DataIntegrityViolationException e) {
            // Manejar violaciones de restricciones únicas
            String message = e.getMessage().toLowerCase();
            if (message.contains("usuario")) {
                throw new IllegalArgumentException("El nombre de usuario ya existe");
            } else if (message.contains("correo") || message.contains("email")) {
                throw new IllegalArgumentException("El correo electrónico ya está registrado");
            } else {
                throw new IllegalArgumentException("Error de integridad de datos");
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al guardar el usuario: " + e.getMessage(), e);
        }
    }


    @Transactional
    public void limpiarFotosHuerfanas() {
        try {
            Path directorioFotos = Paths.get(uploadDir);
            if (!Files.exists(directorioFotos)) {
                return;
            }

            // Obtener lista de fotos en uso
            List<String> fotosEnUso = usuarioRepository.findAll()
                    .stream()
                    .map(Usuario::getFoto)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // Listar archivos en el directorio
            Files.list(directorioFotos)
                    .filter(Files::isRegularFile)
                    .forEach(archivo -> {
                        String nombreArchivo = archivo.getFileName().toString();
                        if (!fotosEnUso.contains(nombreArchivo)) {
                            try {
                                Files.delete(archivo);
                                System.out.println("Foto huérfana eliminada: " + nombreArchivo);
                            } catch (IOException e) {
                                System.err.println("Error eliminando foto huérfana: " + nombreArchivo);
                            }
                        }
                    });
        } catch (IOException e) {
            System.err.println("Error limpiando fotos huérfanas: " + e.getMessage());
        }
    }


    /**
     * Guarda el archivo de imagen en el servidor.
     *
     * @param fotoFile Archivo de imagen a guardar.
     * @return El nombre único del archivo guardado.
     * @throws IOException Si ocurre un error durante la escritura del archivo.
     */
    private String guardarFoto(MultipartFile fotoFile) throws IOException {
        // Genera un nombre de archivo único para evitar colisiones
        String nombreUnico = UUID.randomUUID().toString() + "_" + fotoFile.getOriginalFilename();
        Path rutaCompleta = Paths.get(uploadDir + nombreUnico);

        // Crea el directorio si no existe
        Files.createDirectories(rutaCompleta.getParent());

        // Escribe el archivo en el disco
        Files.write(rutaCompleta, fotoFile.getBytes());
        return nombreUnico;
    }

    /**
     * Elimina un archivo de foto del sistema de archivos.
     *
     * @param nombreFoto El nombre del archivo de foto a eliminar.
     */
    private void eliminarFoto(String nombreFoto) {
        if (nombreFoto == null || nombreFoto.isEmpty()) {
            return;
        }
        try {
            Path rutaFoto = Paths.get(uploadDir + nombreFoto);
            if (Files.exists(rutaFoto)) {
                Files.delete(rutaFoto);
                System.out.println("Foto eliminada: " + nombreFoto);
            }
        } catch (IOException e) {
            // Log del error pero no lanzar excepción para no interrumpir el flujo
            System.err.println("Error al eliminar la foto: " + nombreFoto + " - " + e.getMessage());
        }
    }


    @Transactional(readOnly = true)
    public long contarUsuarios() {
        // Contamos solo los usuarios que no están eliminados lógicamente
        // Nota: Necesitarás crear este método en tu UsuarioRepository.
        // Ejemplo: long countByEstadoNot(Integer estado);
        return usuarioRepository.countByEstadoNot(2);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        if (id == null || id <= 0) {
            return Optional.empty();
        }
        return usuarioRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> findByUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario.trim().toLowerCase());
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("ID de usuario inválido");
        }

        // Borrado lógico: cambiamos el estado a 2
        Usuario usuario = obtenerUsuarioPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Eliminar la foto del sistema de archivos
        if (usuario.getFoto() != null && !usuario.getFoto().isEmpty()) {
            eliminarFoto(usuario.getFoto());
        }

        usuario.setEstado(2); // 2 significa "eliminado"
        usuarioRepository.save(usuario);
    }

    @Transactional
    public Optional<Usuario> cambiarEstadoUsuario(Long id) {
        if (id == null || id <= 0) {
            return Optional.empty();
        }

        return obtenerUsuarioPorId(id).map(usuario -> {
            // Solo alterna entre 0 (inactivo) y 1 (activo)
            if (usuario.getEstado() == 1) {
                usuario.setEstado(0); // Desactivar
            } else if (usuario.getEstado() == 0) {
                usuario.setEstado(1); // Activar
            }
            // No se hace nada si el estado es 2 (eliminado)
            return usuarioRepository.save(usuario);
        });
    }

    /**
     * Verifica si un nombre de usuario ya existe
     */
    @Transactional(readOnly = true)
    public boolean existeUsuario(String nombreUsuario) {
        if (nombreUsuario == null || nombreUsuario.trim().isEmpty()) {
            return false;
        }
        // Utiliza el método eficiente del repositorio
        return usuarioRepository.existsByUsuario(nombreUsuario.trim().toLowerCase());
    }

    /**
     * Verifica si un correo ya existe
     */
    @Transactional(readOnly = true)
    public boolean existeCorreo(String correo) {
        if (correo == null || correo.trim().isEmpty()) {
            return false;
        }
        // Utiliza el método eficiente del repositorio
        return usuarioRepository.existsByCorreo(correo.trim().toLowerCase());
    }

    /**
     * Verifica la contraseña de un usuario
     */
    public boolean verificarContrasena(String contrasenaTextoPlano, String contrasenaEncriptada) {
        return passwordEncoder.matches(contrasenaTextoPlano, contrasenaEncriptada);
    }
}