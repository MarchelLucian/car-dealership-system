/**
 * Controller for car image management.
 * Handles upload and linking of images to vehicles in stock.
 *
 * @author Marchel Lucian
 * @version 12 January 2026
 */

package com.dealerauto.app.controller;

import com.dealerauto.app.service.CarImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/car-images")
public class CarImageController {

    @Autowired
    private CarImageService carImageService;

    @GetMapping("/{brand}/{model}")
    public ResponseEntity<List<String>> getCarImages(
            @PathVariable String brand,
            @PathVariable String model) {

        List<String> images = carImageService.fetchCarImages(brand, model);

        if (images.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(images);
    }
}