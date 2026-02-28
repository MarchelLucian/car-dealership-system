/**
 * REST controller for dashboard statistics with date range filtering.
 *
 * @author Marchel Lucian
 * @version 12 January 2026
 */
package com.dealerauto.app.controller;

import com.dealerauto.app.dao.DashboardDAO;
import com.dealerauto.app.dto.dashboard.DashboardStats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardStatsController {

    @Autowired
    private DashboardDAO dashboardDAO;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats( // ← Returnează DashboardStats
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // System.out.println("🔍 API called with startDate=" + startDate + ", endDate="
        // + endDate);

        DashboardStats stats;

        if (startDate == null || endDate == null) {
            stats = dashboardDAO.getAllTimeStats();
        } else {
            stats = dashboardDAO.getStatsByDateRange(startDate, endDate);
        }

        return ResponseEntity.ok(stats);
    }
}