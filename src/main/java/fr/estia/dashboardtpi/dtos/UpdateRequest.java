package fr.estia.dashboardtpi.dtos;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class UpdateRequest {
    private String table;
    private List<String> columns;
    private List<Map<String, Object>> data;
}
