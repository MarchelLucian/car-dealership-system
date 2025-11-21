package com.dealerauto.app.controller;

import com.dealerauto.app.dao.ManagerLoginDAO;
import com.dealerauto.app.model.Manager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ManagerController {

    @Autowired
    private ManagerLoginDAO managerLoginDAO;

    // Afișează formularul de login
    @GetMapping("/manager-login")
    public String showLoginForm(@RequestParam(value = "error", required = false) String error,
                                Model model) {

        if (error != null) {
            model.addAttribute("error", "Invalid username or password! Please try again!");
        }

        return "manager-login";   // fișierul HTML din templates
    }

    // Procesează login-ul
    @PostMapping("/manager-login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        try {
            Manager manager = managerLoginDAO.findByUsername(username);

            if (manager != null && manager.getPassword().equals(password)) {
                return "redirect:/manager-dashboard";
            }

        } catch (Exception e) {
            return "redirect:/manager-login?error=true";
        }

        return "redirect:/manager-login?error=true";
    }

    // Pagina dashboard a managerului
    @GetMapping("/manager-dashboard")
    public String managerDashboard() {
        return "manager-dashboard";
    }
}
