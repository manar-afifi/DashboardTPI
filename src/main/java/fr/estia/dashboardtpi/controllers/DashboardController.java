/*package fr.estia.dashboardtpi.controllers;

import fr.estia.dashboardtpi.services.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboards")
@RequiredArgsConstructor
public class DashboardController {

    private final IDashboardService dashboardService;

    // 🔁 Endpoint pour synchroniser les dashboards depuis Metabase
    @GetMapping("/sync")
    public ResponseEntity<String> syncDashboards() {
        dashboardService.syncDashboardsFromMetabase();
        return ResponseEntity.ok("Synchronisation terminée !");
    }

    // 📊 Endpoint pour récupérer les stats par période (daily, monthly, etc.)
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats(
            @RequestParam(defaultValue = "daily") String period) {
        return ResponseEntity.ok(dashboardService.getDashboardStatsByPeriod(period));
    }
}*/
