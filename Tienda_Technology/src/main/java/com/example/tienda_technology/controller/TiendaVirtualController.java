package com.example.tienda_technology.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TiendaVirtualController {

    @GetMapping("/tienda")
    public String tiendaVirtual() {
        return "TiendaVirtual/index"; // Retorna tu página de ecommerce
    }


    @GetMapping("/")
    public String home() {
        return "redirect:/tienda"; // Redirige a la tienda virtual
    }
}