package fr.estia.dashboardtpi.services;

import fr.estia.dashboardtpi.entities.AlertRule;
import fr.estia.dashboardtpi.repositories.AlertRuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertRuleRepository alertRuleRepository;
    private final MetabaseService metabaseService;
    private final EmailService emailService;

    @Scheduled(fixedRate = 300000)
    public void checkAllRules() {
        List<AlertRule> rules = alertRuleRepository.findAll();
        rules.forEach(this::checkRule);
    }

    private void checkRule(AlertRule rule) {
        try {
            Map<String, Object> data = metabaseService.getCardData(rule.getCardId());

            if (evaluateCondition(data, rule)) {
                notifyUsers(rule);
            }
        } catch (Exception e) {
            log.error("Error checking rule " + rule.getId(), e);
        }
    }

    private boolean evaluateCondition(Map<String, Object> data, AlertRule rule) {
        double value = extractValue(data, rule.getMetric());
        switch (rule.getCondition()) {
            case ">": return value > rule.getThreshold();
            case "<": return value < rule.getThreshold();
            case "==": return value == rule.getThreshold();
            default: return false;
        }
    }

    private double extractValue(Map<String, Object> data, String metric) {
        Object val = data.get("data");
        if (val instanceof List && !((List<?>) val).isEmpty()) {
            Object firstRow = ((List<?>) val).get(0);
            if (firstRow instanceof Map) {
                Object metricValue = ((Map<?, ?>) firstRow).get(metric);
                if (metricValue instanceof Number) {
                    return ((Number) metricValue).doubleValue();
                }
            }
        }
        return 0;
    }

    private void notifyUsers(AlertRule rule) {
        emailService.sendAlertEmail(
                rule.getCreatedBy().getEmail(),
                "Alerte déclenchée: " + rule.getName(),
                rule.getNotificationMessage()
        );
    }
}
