/*package fr.estia.dashboardtpi.services;

import fr.estia.dashboardtpi.entities.Dashboard;
import fr.estia.dashboardtpi.repositories.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements IDashboardService {

    private final DashboardRepository dashboardRepository;

    // 🟣 Méthode de synchronisation fictive
    public void syncDashboardsFromMetabase() {
        // 🧪 Simulation de dashboards récupérés depuis Metabase
        List<Map<String, Object>> externalDashboards = List.of(
                Map.of("id", 1L, "name", "Dashboard Ventes"),
                Map.of("id", 2L, "name", "Dashboard RH"),
                Map.of("id", 3L, "name", "Dashboard Finance")
        );

        for (Map<String, Object> external : externalDashboards) {
            Long metabaseId = (Long) external.get("id");
            String name = (String) external.get("name");

            boolean exists = dashboardRepository.existsByMetabaseId(metabaseId);
            if (!exists) {
                Dashboard d = new Dashboard();
                d.setMetabaseId(metabaseId);
                d.setName(name);

                // ⏱ Générer une date aléatoire dans les 6 derniers mois
                Random random = new Random();
                LocalDateTime randomDate = LocalDateTime.now().minusDays(random.nextInt(180));
                d.setCreatedAt(randomDate);

                dashboardRepository.save(d);
            }

        }
    }

    // 📈 Récupère les stats selon période : daily, monthly, etc.
    public Map<String, Long> getDashboardStatsByPeriod(String period) {
        List<Dashboard> dashboards = dashboardRepository.findAll();
        Map<String, Long> result = new TreeMap<>();

        for (Dashboard d : dashboards) {
            String key = switch (period) {
                case "monthly" -> d.getCreatedAt().getYear() + "-" + String.format("%02d", d.getCreatedAt().getMonthValue());
                case "quarterly" -> d.getCreatedAt().getYear() + " - Q" + ((d.getCreatedAt().getMonthValue() - 1) / 3 + 1);
                case "yearly" -> String.valueOf(d.getCreatedAt().getYear());
                default -> d.getCreatedAt().toLocalDate().toString(); // daily
            };
            result.put(key, result.getOrDefault(key, 0L) + 1);
        }

        return result;
    }
}*/
