package fr.estia.dashboardtpi.services;

import fr.estia.dashboardtpi.dtos.UtilisateurDTO;
import fr.estia.dashboardtpi.entities.Utilisateur;
import fr.estia.dashboardtpi.mappers.UtilisateurMapper;
import fr.estia.dashboardtpi.repositories.UtilisateurRepository;
import fr.estia.dashboardtpi.services.IUtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UtilisateurServiceImpl implements IUtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final UtilisateurMapper utilisateurMapper;

    @Override
    public UtilisateurDTO ajouterUtilisateur(UtilisateurDTO utilisateurDTO) {
        // Vérifie si l'email existe déjà
        if (utilisateurRepository.existsByEmail(utilisateurDTO.getEmail())) {
            throw new RuntimeException("Erreur : Cet email est déjà utilisé !");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNomUtilisateur(utilisateurDTO.getNomUtilisateur());
        utilisateur.setEmail(utilisateurDTO.getEmail());
        utilisateur.setMotDepasse(utilisateurDTO.getMotDepasse());

        utilisateurRepository.save(utilisateur);
        return utilisateurDTO;
    }

    @Override
    public UtilisateurDTO obtenirUtilisateurParId(Long idUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return utilisateurMapper.toDto(utilisateur);
    }

    @Override
    public List<UtilisateurDTO> obtenirTousLesUtilisateurs() {
        return utilisateurRepository.findAll().stream()
                .map(utilisateurMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public UtilisateurDTO modifierUtilisateur(Long idUtilisateur, UtilisateurDTO utilisateurDTO) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (utilisateurDTO.getNomUtilisateur() != null) {
            utilisateur.setNomUtilisateur(utilisateurDTO.getNomUtilisateur());
        }
        if (utilisateurDTO.getEmail() != null) {
            utilisateur.setEmail(utilisateurDTO.getEmail());
        }

        if (utilisateurDTO.getMotDepasse() != null) {
            utilisateur.setMotDepasse(utilisateurDTO.getMotDepasse());
        }
        if (utilisateurDTO.getPhotoUtilisateur() != null) {
            utilisateur.setPhotoUtilisateur(utilisateurDTO.getPhotoUtilisateur());
        }

        Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toDto(updatedUtilisateur);
    }


    @Override
    public void supprimerUtilisateur(Long idUtilisateur) {
        if (!utilisateurRepository.existsById(idUtilisateur)) {
            throw new RuntimeException("Utilisateur non trouvé");
        }
        utilisateurRepository.deleteById(idUtilisateur);
    }
    @Override
    public UtilisateurDTO updateUtilisateurInfo(Long id, String newName, MultipartFile file) {
        // Vérification si l utilisateur existe
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));

        // Mis à jour le nom de l'utilisateur
        if (newName != null && !newName.trim().isEmpty()) {
            utilisateur.setNomUtilisateur(newName);
        }

        if (file != null && !file.isEmpty()) {
            try {
                byte[] imageBytes = file.getBytes();
                String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                utilisateur.setPhotoUtilisateur(base64Image);
            } catch (IOException e) {
                throw new RuntimeException("Erreur lors de l'upload de la photo", e);
            }
        }

        Utilisateur updatedUtilisateur = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toDto(updatedUtilisateur);
    }
}
