/**
 * Controller for user logout (agents and clients).
 * Invalidates sessions and redirects to login pages.
 *
 * @author Marchel Lucian
 * @version 12 January 2026
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
