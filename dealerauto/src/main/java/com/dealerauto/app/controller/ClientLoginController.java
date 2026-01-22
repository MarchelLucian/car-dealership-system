/**
 * Controller pentru autentificarea clienților în sistem.
 * Gestionează procesul de login și crearea sesiunilor pentru clienți.
 *
 * @author Marchel Lucian
 * @version 12 Ianuarie 2026
 */
package com.dealerauto.app.controller;

import com.dealerauto.app.dao.ClientUserDAO;
import com.dealerauto.app.model.ClientUser;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class ClientLoginController {

    @Autowired
    private ClientUserDAO clientUserDAO;

    @GetMapping("/client-login")
    public String showLoginForm() {
        return "client-login";
    }

    @PostMapping("/client-login")
    public String login(
            @RequestParam String email,
            @RequestParam String password,
            HttpSession session,
            Model model
    ) {
        try {
            ClientUser user = clientUserDAO.findByEmail(email);

            if (user != null && user.getPassword().equals(password)) {

                String clientName = clientUserDAO.getClientName(user.getClientId());
                String clientSecondName = clientUserDAO.getClientSecondName(user.getClientId());
                // ===== GENERAM INITIALELE =====
                String initials =clientName.substring(0, 1).toUpperCase();
                if (clientSecondName != null && !clientSecondName.isBlank()) {
                    initials += clientSecondName.substring(0, 1).toUpperCase();
                }


                // salvăm userul în sesiune
                session.setAttribute("clientId", user.getClientId());
                session.setAttribute("clientEmail", user.getEmail());
                session.setAttribute("clientName", clientName);
                session.setAttribute("clientSecondName", clientSecondName);
                session.setAttribute("clientInitials", initials);
                // redirect către pagina de oferte
                return "redirect:/client";
            }

        } catch (Exception ignored) {}

        model.addAttribute("error", "Invalid email or password!");
        return "client-login";
    }
}
