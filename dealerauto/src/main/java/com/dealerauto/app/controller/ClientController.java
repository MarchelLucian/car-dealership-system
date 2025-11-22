package com.dealerauto.app.controller;

import com.dealerauto.app.model.Masina;
import com.dealerauto.app.dao.MasinaDAO;
import com.dealerauto.app.dao.ClientUserDAO;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class ClientController {

    @Autowired
    private MasinaDAO masinaDAO;

    @Autowired
    private ClientUserDAO clientUserDAO;

    // Pagina principală /client
    @GetMapping("/client")
    public String paginaClient(
            @RequestParam(defaultValue = "0") int page,
            HttpSession session,
            Model model) {

        int limit = 5;
        int offset = page * limit;

        List<Masina> masini = masinaDAO.getMasiniDisponibile(offset, limit);

        model.addAttribute("masini", masini);
        model.addAttribute("page", page);

        // -------------------- NOUL COD ---------------------
        Integer clientId = (Integer) session.getAttribute("clientId");
        String clientName = (String) session.getAttribute("clientName");
        String clientSecondName = (String) session.getAttribute("clientSecondName");
        String clientInitials = (String) session.getAttribute("clientInitials");

        boolean isLogged = clientId != null;

        model.addAttribute("isLogged", isLogged);

        if (isLogged) {
            model.addAttribute("clientName", clientName); // Nume
            model.addAttribute("clientSecondName", clientSecondName); // Prenume
            model.addAttribute("clientInitials", clientInitials); // Inițiale
        }
// -----------------------------------------------------


        return "client";
    }

    // AJAX pentru încărcare oferte
    @GetMapping("/client/data")
    @ResponseBody
    public List<Masina> getCarsAjax(@RequestParam int page) {

        int limit = 5;
        int offset = page * limit;

        return masinaDAO.getMasiniDisponibile(offset, limit);
    }
}
