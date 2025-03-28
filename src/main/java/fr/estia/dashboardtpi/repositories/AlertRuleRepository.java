package fr.estia.dashboardtpi.repositories;

import fr.estia.dashboardtpi.entities.AlertRule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AlertRuleRepository extends JpaRepository<AlertRule, Long> {

    List<AlertRule> findByCreatedBy_Email(String username);
}
