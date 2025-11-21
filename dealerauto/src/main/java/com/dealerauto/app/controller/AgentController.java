package com.dealerauto.app.controller;

import com.dealerauto.app.dao.AgentLoginDAO;
import com.dealerauto.app.model.Agent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AgentController {

    @Autowired
    private AgentLoginDAO loginDAO;

    // Afișează formularul de login
    @GetMapping("/agent-login")
    public String showLoginForm(@RequestParam(value = "error", required = false) String error,
                                Model model) {

        if (error != null) {
            model.addAttribute("error", "Invalid username or password! Please try again!");
        }

        return "agent-login";   // HTML-ul tău
    }

    // Procesează login-ul
    @PostMapping("/agent-login")
    public String login(@RequestParam String username,
                        @RequestParam String password) {

        try {
            Agent agent = loginDAO.findByUsername(username);

            // verificare parola
            if (agent != null && agent.getPassword().equals(password)) {
                return "redirect:/agent-dashboard";
            }

        } catch (Exception e) {
            // dacă nu există username sau altă eroare
            return "redirect:/agent-login?error=true";
        }

        return "redirect:/agent-login?error=true";
    }

    // Dashboard după autentificare
    @GetMapping("/agent-dashboard")
    public String agentDashboard() {
        return "agent-dashboard";
    }
}
