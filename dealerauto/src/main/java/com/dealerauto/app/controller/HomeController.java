/**
 * Controller pentru pagina principală (home page) a aplicației.
 * Gestionează landing page-ul și navigarea către secțiunile principale.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() { return "index"; }

}
