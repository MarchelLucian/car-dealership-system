/**
 * Controller for the application home page.
 * Handles the landing page and navigation to main sections.
 *
 * @author Marchel Lucian
 * @version 12 January 2026
 */
package com.dealerauto.app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "index";
    }

}
