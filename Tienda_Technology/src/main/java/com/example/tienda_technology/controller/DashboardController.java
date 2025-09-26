// Define el paquete al que pertenece la clase.
package com.example.tienda_technology.controller;

// Importaciones de clases necesarias de otros paquetes.

import com.example.tienda_technology.service.CategoriaServiceImpl;
import com.example.tienda_technology.service.PerfilServiceImpl;
import com.example.tienda_technology.service.ProductoServiceImpl;
import com.example.tienda_technology.service.UsuarioService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

// @Controller: Marca esta clase como un controlador de Spring MVC, encargado de manejar peticiones web.
@Controller
public class DashboardController {

    // Declara una dependencia final al servicio de usuario. 'final' asegura que se
    // inicialice en el constructor.
    private final UsuarioService usuarioService;
    private final ProductoServiceImpl productoService;
    private final CategoriaServiceImpl categoriaService;
    private final PerfilServiceImpl perfilService;

    // Constructor para la inyección de dependencias. Spring automáticamente
    // proporcionará una instancia de UsuarioService.
    public DashboardController(UsuarioService usuarioService, ProductoServiceImpl productoService, CategoriaServiceImpl categoriaService, PerfilServiceImpl perfilService) {
        this.perfilService = perfilService;
        this.categoriaService = categoriaService;
        this.productoService = productoService;
        this.usuarioService = usuarioService;
    }

    // @GetMapping("/"): Asocia este método a las peticiones HTTP GET para la URL
    // raíz ("/").
    // Es la página principal que se muestra después de iniciar sesión.
    @GetMapping("/dashboard")
    public String mostrarDashboard(Model model) {
        // 1. Llama al método contarUsuarios() del servicio para obtener el número total
        // de usuarios activos e inactivos (excluyendo los eliminados).
        long totalUsuarios = usuarioService.contarUsuarios();
        long totalProductos = productoService.contarProductos();
        long totalCategorias = categoriaService.contarCategoriasActivas();
        long totalPerfiles = perfilService.countByEstado(true);


        // 2. 'model' es un objeto que permite pasar datos desde el controlador a la
        // vista (HTML).
        // Aquí, añadimos el conteo de usuarios al modelo con el nombre "totalUsuarios".
        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("totalProductos", totalProductos);
        model.addAttribute("totalCategorias", totalCategorias);
        model.addAttribute("totalPerfiles", totalPerfiles);

        // 3. Devuelve el nombre de la vista (el archivo HTML) que se debe renderizar.
        // Spring Boot buscará un archivo llamado "index.html" en la carpeta
        // 'src/main/resources/templates'.
        return "GestionTienda/index";
    }
}