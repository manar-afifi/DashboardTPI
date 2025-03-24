package fr.estia.dashboardtpi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/table")
public class TableController {

    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/create")
    public ResponseEntity<String> createTable(@RequestBody Map<String, Object> request) {
        String table = (String) request.get("table");
        Map<String, String> columns = (Map<String, String>) request.get("columns");

        if (table == null || columns == null || columns.isEmpty()) {
            return ResponseEntity.badRequest().body("❌ Table name or columns missing");
        }

        String columnsDef = columns.entrySet().stream()
                .map(entry -> entry.getKey() + " " + entry.getValue())
                .collect(Collectors.joining(", "));

        String sql = "CREATE TABLE IF NOT EXISTS " + table + " (" + columnsDef + ")";

        try {
            jdbcTemplate.execute(sql);
            return ResponseEntity.ok("✅ Table '" + table + "' créée !");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("❌ Erreur : " + e.getMessage());
        }
    }
}
