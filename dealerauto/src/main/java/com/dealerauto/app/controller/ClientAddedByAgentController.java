package com.dealerauto.app.controller;

import com.dealerauto.app.dao.ClientDAO;
import com.dealerauto.app.model.Agent;
import com.dealerauto.app.model.Client;
import jakarta.servlet.http.HttpSession;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/agent-dashboard/sales")
public class ClientAddedByAgentController {

    private final ClientDAO clientDAO;

    public ClientAddedByAgentController(ClientDAO clientDAO) {
        this.clientDAO = clientDAO;
    }

    // =========================
    // FORM ADD CLIENT
    // =========================
    @GetMapping("/add-client")
    public String showAddClientForm(Model model, HttpSession session) {

        Agent agent = (Agent) session.getAttribute("agent");
        model.addAttribute("agent", agent);

        return "add-client";
    }

    // =========================
    // SAVE CLIENT
    // =========================
    @PostMapping("/add-client")
    public String saveClient(
            @RequestParam String tip_client,
            @RequestParam String nume,
            @RequestParam(required = false) String prenume,
            @RequestParam String cnp_cui,
            @RequestParam String telefon,
            @RequestParam String email,
            @RequestParam String adresa,
            RedirectAttributes redirectAttributes
    ) {

        // ---- VALIDARE DE BAZĂ ----
        boolean invalid =
                tip_client == null || tip_client.isBlank() ||
                        nume == null || nume.isBlank() ||
                        telefon == null || telefon.isBlank() ||
                        email == null || email.isBlank() ||
                        adresa == null || adresa.isBlank();

        if (invalid) {
            redirectAttributes.addFlashAttribute(
                    "errorMessage", "All required fields must be completed."
            );
            return "redirect:/agent-dashboard/sales/add-client";
        }

        String cnp = null;
        String cui = null;

// ---- VALIDARE TIP CLIENT ----
        if ("persoana fizica".equals(tip_client)) {

            if (cnp_cui == null || cnp_cui.isBlank()) {
                redirectAttributes.addFlashAttribute(
                        "errorMessage", "CNP is required for physical persons."
                );
                return "redirect:/agent-dashboard/sales/add-client";
            }

            cnp = cnp_cui;   // 👈
            cui = null;

        }

        if ("firma".equals(tip_client)) {

            if (cnp_cui == null || cnp_cui.isBlank()) {
                redirectAttributes.addFlashAttribute(
                        "errorMessage", "CUI is required for companies."
                );
                return "redirect:/agent-dashboard/sales/add-client";
            }

            cui = cnp_cui;   // 👈
            cnp = null;
            prenume = null;
        }


        // ---- CREARE CLIENT ----
        Client c = new Client();
        c.setTip_client(tip_client);
        c.setNume(nume);
        c.setPrenume(prenume);
        c.setCnp(cnp);
        c.setCui(cui);
        c.setTelefon(telefon);
        c.setEmail(email);
        c.setAdresa(adresa);

        try {
            clientDAO.insert(c);
        } catch (DataIntegrityViolationException e) {

            String msg = e.getMostSpecificCause().getMessage().toLowerCase();

            if (msg.contains("cnp") || msg.contains("cui")) {
                redirectAttributes.addFlashAttribute(
                        "errorMessage", "A client with this CNP / CUI already exists."
                );
                redirectAttributes.addFlashAttribute("telefon", telefon);
                redirectAttributes.addFlashAttribute("email", email);
            } else if (msg.contains("telefon")) {
                redirectAttributes.addFlashAttribute(
                        "errorMessage", "This phone number is already used."
                );
                redirectAttributes.addFlashAttribute("cnp_cui", cnp_cui);
                redirectAttributes.addFlashAttribute("email", email);
            } else if (msg.contains("email")) {
                redirectAttributes.addFlashAttribute(
                        "errorMessage", "This email address is already used."
                );
                redirectAttributes.addFlashAttribute("cnp_cui", cnp_cui);
                redirectAttributes.addFlashAttribute("telefon", telefon);
            } else {
                redirectAttributes.addFlashAttribute(
                        "errorMessage", "Client already exists (duplicate data)."
                );
                redirectAttributes.addFlashAttribute("cnp_cui", cnp_cui);
                redirectAttributes.addFlashAttribute("telefon", telefon);
                redirectAttributes.addFlashAttribute("email", email);
            }

            //  PĂSTRĂM DATELE
            redirectAttributes.addFlashAttribute("tip_client", tip_client);
            redirectAttributes.addFlashAttribute("nume", nume);
            redirectAttributes.addFlashAttribute("prenume", prenume);
            redirectAttributes.addFlashAttribute("adresa", adresa);

            return "redirect:/agent-dashboard/sales/add-client";
        }


        redirectAttributes.addFlashAttribute(
                "successMessage",
                "Client successfully created. You may now register a sale."
        );

        return "redirect:/agent-dashboard/sales/add-client";
    }
}
