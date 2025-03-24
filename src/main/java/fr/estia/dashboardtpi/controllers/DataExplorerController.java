package fr.estia.dashboardtpi.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/explorer")
@RequiredArgsConstructor
public class DataExplorerController {

    private final JdbcTemplate jdbcTemplate;

    // 📦 Lister les tables disponibles dans le schéma "public"
    @GetMapping("/tables")
    public ResponseEntity<List<String>> listTables() {
        String sql = "SELECT table_name FROM information_schema.tables WHERE table_schema='public'";
        List<String> tables = jdbcTemplate.queryForList(sql, String.class);
        return ResponseEntity.ok(tables);
    }

    // 📊 Obtenir les données d'une table (limitée à 100 lignes)
    @GetMapping("/table/{name}")
    public ResponseEntity<List<Map<String, Object>>> getTableData(@PathVariable String name) {
        String sql = "SELECT * FROM " + name + " LIMIT 100";
        List<Map<String, Object>> data = jdbcTemplate.queryForList(sql);
        return ResponseEntity.ok(data);
    }
}
