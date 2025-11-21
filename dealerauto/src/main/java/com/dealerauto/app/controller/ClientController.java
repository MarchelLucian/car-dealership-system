package com.dealerauto.app.controller;

import com.dealerauto.app.model.Masina;
import com.dealerauto.app.dao.MasinaDAO;
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

    // Pagina principală /client (primele 10 mașini)
    @GetMapping("/client")
    public String paginaClient(
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        int limit = 5;
        int offset = page * limit;

        List<Masina> masini = masinaDAO.getMasiniDisponibile(offset, limit);

        model.addAttribute("masini", masini);
        model.addAttribute("page", page);

        return "client";
    }

    // AJAX: returnează următoarele 10 mașini
    @GetMapping("/client/data")
    @ResponseBody
    public List<Masina> getCarsAjax(@RequestParam int page) {

        int limit = 5;
        int offset = page * limit;

        return masinaDAO.getMasiniDisponibile(offset, limit);
    }
}
