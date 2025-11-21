package com.dealerauto.app.controller;

import com.dealerauto.app.dao.ClientRegisterDAO;
import com.dealerauto.app.model.Client;
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

    // Afisează pagina de creare cont
    @GetMapping("/client-register")
    public String showRegisterForm() {
        return "client-register";
    }

    // Procesează datele introduse în formular
    @PostMapping("/client-register")
    public String registerClient(
            @RequestParam String tip_client,
            @RequestParam String nume,
            @RequestParam String prenume,
            @RequestParam(required = false) String cnp,
            @RequestParam(required = false) String cui,
            @RequestParam String telefon,
            @RequestParam String email,
            @RequestParam(required = false) String adresa,
            Model model
    ) {

        // Convertim "---" la NULL
        if ("---".equals(cnp)) cnp = null;
        if ("---".equals(prenume)) prenume = null;
        if ("---".equals(cui)) cui = null;

        // VALIDARE EMAIL EXISTENT
        if (clientDAO.emailExists(email)) {
            model.addAttribute("error", "Email already exists!");
            return "client-register";
        }

        // VALIDARE TELEFON EXISTENT
        if (clientDAO.phoneExists(telefon)) {
            model.addAttribute("error", "Phone number already exists!");
            return "client-register";
        }

        // Obiectul client
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
            clientDAO.save(client);
            model.addAttribute("success", "Client account created successfully!");
        } catch (Exception e) {
            model.addAttribute("error", "Error: Email or phone already exists!");
        }

        return "client-register";
    }
}
