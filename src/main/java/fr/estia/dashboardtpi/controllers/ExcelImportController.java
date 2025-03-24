package fr.estia.dashboardtpi.controllers;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/import")
public class ExcelImportController {

    private final JdbcTemplate jdbcTemplate;

    @PostMapping("/excel-auto")
    public ResponseEntity<String> importExcelAutoCreateTable(@RequestParam("file") MultipartFile file,
                                                             @RequestParam("table") String tableName) {
        try (InputStream is = file.getInputStream(); Workbook workbook = new XSSFWorkbook(is)) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);

            List<String> columnNames = new ArrayList<>();
            for (Cell cell : headerRow) {
                columnNames.add(cell.getStringCellValue().replaceAll("[^a-zA-Z0-9_]", "_"));
            }

            // 🔨 Création dynamique de la table
            String createTableSql = "CREATE TABLE IF NOT EXISTS " + tableName + " ("
                    + columnNames.stream().map(col -> col + " TEXT").collect(Collectors.joining(", "))
                    + ")";
            jdbcTemplate.execute(createTableSql);

            // 🔁 Insertion des lignes
            String insertSql = "INSERT INTO " + tableName + " (" + String.join(", ", columnNames) + ") VALUES ("
                    + columnNames.stream().map(c -> "?").collect(Collectors.joining(", ")) + ")";

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                Object[] values = new Object[columnNames.size()];

                for (int j = 0; j < columnNames.size(); j++) {
                    values[j] = getCellValue(row.getCell(j));
                }

                jdbcTemplate.update(insertSql, values);
            }

            return ResponseEntity.ok("✅ Table '" + tableName + "' créée et données importées !");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("❌ Erreur : " + e.getMessage());
        }
    }


    private Object getCellValue(Cell cell) {
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> DateUtil.isCellDateFormatted(cell) ? cell.getDateCellValue() : cell.getNumericCellValue();
            case BOOLEAN -> cell.getBooleanCellValue();
            case FORMULA -> cell.getCellFormula();
            default -> null;
        };
    }
}