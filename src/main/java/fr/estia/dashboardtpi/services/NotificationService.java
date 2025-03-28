package fr.estia.dashboardtpi.services;

import fr.estia.dashboardtpi.entities.Utilisateur;
import fr.estia.dashboardtpi.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final EmailService emailService;
    private final UtilisateurRepository userRepository;

    private final String metabaseUrl = "http://localhost:3000";

    public void notifyNewDashboard(String dashboardName, String creator, int dashboardId) {
        List<Utilisateur> allUsers = userRepository.findAll();

        allUsers.forEach(user -> {
            String message = String.format(
                    "Nouveau tableau '%s' créé par %s\n\nAccédez-y ici: %s/dashboard/%d",
                    dashboardName, creator, metabaseUrl, dashboardId
            );

            emailService.sendAlertEmail(
                    user.getEmail(),
                    "Nouveau tableau disponible",
                    message
            );
        });
    }
}
