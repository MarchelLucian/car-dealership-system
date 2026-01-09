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

        // PĂSTRĂM TOATE VALORILE INTRODUSE (le trimitem înapoi la formular)
        model.addAttribute("tip_client", tip_client);
        model.addAttribute("nume", nume);
        model.addAttribute("prenume", prenume);
        model.addAttribute("telefon", telefon);
        model.addAttribute("email", email);
        model.addAttribute("adresa", adresa);
        // NU trimitem parola înapoi (securitate)

        // VALIDĂRI INDIVIDUALE

        // 1. EMAIL
        if (clientUserDAO.emailExists(email)) {
            model.addAttribute("error", "Email already exists!");
            model.addAttribute("email", ""); // Golim doar email-ul
            return "client-register";
        }

        // 2. TELEFON
        if (clientDAO.phoneExists(telefon)) {
            model.addAttribute("error", "Phone number already exists!");
            model.addAttribute("telefon", ""); // Golim doar telefonul
            return "client-register";
        }

        // 3. CNP (doar pentru persoană fizică)
        if (cnp != null && !cnp.isEmpty() && clientDAO.cnpExists(cnp)) {
            model.addAttribute("error", "CNP already exists!");
            model.addAttribute("cnp", ""); // Golim doar CNP-ul
            return "client-register";
        }

        // 4. CUI (doar pentru firmă)
        if (cui != null && !cui.isEmpty() && clientDAO.cuiExists(cui)) {
            model.addAttribute("error", "CUI already exists!");
            model.addAttribute("cui", ""); // Golim doar CUI-ul
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

            // Goliim toate câmpurile după success
            model.addAttribute("tip_client", "");
            model.addAttribute("nume", "");
            model.addAttribute("prenume", "");
            model.addAttribute("cnp", "");
            model.addAttribute("cui", "");
            model.addAttribute("telefon", "");
            model.addAttribute("email", "");
            model.addAttribute("adresa", "");

        } catch (Exception e) {
            model.addAttribute("error", "Error: Registration failed!");
        }

        return "client-register";
    }
}