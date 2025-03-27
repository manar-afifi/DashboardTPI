package fr.estia.dashboardtpi.controllers;

import fr.estia.dashboardtpi.dtos.UpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.StringJoiner;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/card")
public class CardEditController {

    private final JdbcTemplate jdbcTemplate;
    @PostMapping("/update/{cardId}")
    public ResponseEntity<?> updateCardTable(@PathVariable int cardId, @RequestBody UpdateRequest req) {
        try {
            String tableName = req.getTable();


            if (tableName == null || tableName.isBlank()) {
                throw new IllegalArgumentException("Table non spécifiée !");
            }


            jdbcTemplate.execute("DELETE FROM " + tableName);


            for (Map<String, Object> row : req.getData()) {
                StringBuilder columns = new StringBuilder();
                StringBuilder values = new StringBuilder();

                for (String col : req.getColumns()) {
                    columns.append(col).append(",");
                    values.append("'").append(row.get(col)).append("',");
                }

                String insert = String.format("INSERT INTO %s (%s) VALUES (%s)",
                        tableName,
                        columns.substring(0, columns.length() - 1),
                        values.substring(0, values.length() - 1)
                );
                jdbcTemplate.execute(insert);
            }

            return ResponseEntity.ok("✅ Mise à jour réussie");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ Erreur : " + e.getMessage());
        }
    }


}
