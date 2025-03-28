package fr.estia.dashboardtpi.controllers;

import fr.estia.dashboardtpi.entities.AlertRule;
import fr.estia.dashboardtpi.repositories.AlertRuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alert-rules")
@RequiredArgsConstructor
public class AlertRuleController {

    private final AlertRuleRepository repository;

    @PostMapping
    public ResponseEntity<AlertRule> createRule(@RequestBody AlertRule rule) {

        return ResponseEntity.ok(repository.save(rule));
    }

    @GetMapping("/my-rules")
    public List<AlertRule> getAllRules() {
        return repository.findAll();
    }
}
