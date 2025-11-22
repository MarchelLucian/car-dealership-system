package com.dealerauto.app.controller;

import com.dealerauto.app.dao.ClientRegisterDAO;
import com.dealerauto.app.dao.ClientUserDAO;
import com.dealerauto.app.model.Client;
import com.dealerauto.app.model.ClientUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ClientRegisterController {

    @Autowired
    private ClientRegisterDAO clientDAO;

    @Autowired
    private ClientUserDAO clientUserDAO;

    @GetMapping("/client-register")
    public String showRegisterForm() {
        return "client-register";
    }

    @PostMapping("/client-register")
    public String registerClient(
            @RequestParam String tip_client,
            @RequestParam String nume,
            @RequestParam(required = false) String prenume,
            @RequestParam(required = false) String cnp,
            @RequestParam(required = false) String cui,
            @RequestParam String telefon,
            @RequestParam String email,
            @RequestParam(required = false) String adresa,
            @RequestParam String password,
            Model model
    ) {

        // Convertim valorile "---" la NULL
        if ("---".equals(cnp)) cnp = null;
        if ("---".equals(prenume)) prenume = null;
        if ("---".equals(cui)) cui = null;

        // VALIDARE EMAIL EXISTENT (în tabela client_user!!!)
        if (clientUserDAO.emailExists(email)) {
            model.addAttribute("error", "Email already exists!");
            return "client-register";
        }

        // VALIDARE TELEFON EXISTENT (tabela client)
        if (clientDAO.phoneExists(telefon)) {
            model.addAttribute("error", "Phone number already exists!");
            return "client-register";
        }

        // --- CREĂM OBIECTUL CLIENT ---
        Client client = new Client(
                tip_client,
                nume,
                prenume,
                cnp,
                cui,
                telefon,
                email,
                adresa
        );

        try {
            // Salvăm clientul și PRIMIM ID-ul generat
            int clientId = clientDAO.saveAndReturnId(client);

            // --- CREĂM USER-ul PENTRU LOGIN ---
            ClientUser user = new ClientUser(clientId, email, password);

            // Salvăm user-ul în tabela client_user
            clientUserDAO.save(user);

            model.addAttribute("success", "Client account created successfully!");

        } catch (Exception e) {
            model.addAttribute("error", "Error: Email or phone already exists!");
        }

        return "client-register";
    }
}
