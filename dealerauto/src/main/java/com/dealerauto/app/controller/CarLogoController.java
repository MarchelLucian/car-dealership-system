/**
 * REST controller for serving car brand logos.
 * Uses Logo.dev API and caches responses for performance.
 *
 * @author Marchel Lucian
 * @version 12 January 2026
 */
package com.dealerauto.app.controller;

import com.dealerauto.app.service.CarLogoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/car-logo")
public class CarLogoController {

    @Autowired
    private CarLogoService carLogoService;

    @GetMapping(value = "/{brand}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getLogo(@PathVariable String brand) {

        byte[] image = carLogoService.fetchLogo(brand);

        if (image == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(image);
    }
}
