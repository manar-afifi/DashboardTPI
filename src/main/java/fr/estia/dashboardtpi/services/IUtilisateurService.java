package fr.estia.dashboardtpi.services;

import fr.estia.dashboardtpi.dtos.UtilisateurDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IUtilisateurService {
    UtilisateurDTO ajouterUtilisateur(UtilisateurDTO utilisateurDTO);
    UtilisateurDTO obtenirUtilisateurParId(Long idUtilisateur);
    List<UtilisateurDTO> obtenirTousLesUtilisateurs();
    UtilisateurDTO modifierUtilisateur(Long idUtilisateur, UtilisateurDTO utilisateurDTO);
    void supprimerUtilisateur(Long idUtilisateur);

    UtilisateurDTO updateUtilisateurInfo(Long id, String newName, String newEmail, MultipartFile file);

    long countUtilisateurs();

    String getLastAccess();
}
