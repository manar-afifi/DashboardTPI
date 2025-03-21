package fr.estia.dashboardtpi.dtos;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UtilisateurDTO {
    private Long idUtilisateur;
    private String nomUtilisateur;
    private String email;
    private String motDepasse;
    private String photoUtilisateur;
    private List<String> roles;
    private List<String> activityLogs; // Liste des actions de l'utilisateur sous forme de texte
}
