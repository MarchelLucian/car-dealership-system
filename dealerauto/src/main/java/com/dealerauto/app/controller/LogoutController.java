/**
 * Controller pentru gestionarea logout-ului utilizatorilor (agenți și clienți).
 * Invalidează sesiunile și redirecționează către paginile de autentificare.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LogoutController {

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/client";
    }
}
