package fr.estia.dashboardtpi.services;

import fr.estia.dashboardtpi.dtos.UtilisateurDTO;
import fr.estia.dashboardtpi.entities.Utilisateur;
import fr.estia.dashboardtpi.mappers.UtilisateurMapper;
import fr.estia.dashboardtpi.repositories.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
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
/*
    @Override
    public UtilisateurDTO obtenirUtilisateurParId(Long idUtilisateur) {
        Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return utilisateurMapper.toDto(utilisateur);
    }*/
@Override
public UtilisateurDTO obtenirUtilisateurParId(Long idUtilisateur) {
    Utilisateur utilisateur = utilisateurRepository.findById(idUtilisateur)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

    //  Mettre à jour la dernière connexion
    utilisateur.setDerniereConnexion(LocalDateTime.now());
    utilisateurRepository.save(utilisateur);

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
    public UtilisateurDTO updateUtilisateurInfo(Long id, String newName, String newEmail, MultipartFile file) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'ID : " + id));

        if (newName != null && !newName.trim().isEmpty()) {
            utilisateur.setNomUtilisateur(newName);
        }

        if (newEmail != null && !newEmail.trim().isEmpty()) {
            Optional<Utilisateur> utilisateurAvecEmail = utilisateurRepository.findByEmail(newEmail);
            if (utilisateurAvecEmail.isPresent() && !utilisateurAvecEmail.get().getIdUtilisateur().equals(id)) {
                throw new RuntimeException("Cet email est déjà utilisé par un autre utilisateur.");
            }
            utilisateur.setEmail(newEmail);
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

    @Override
    public long countUtilisateurs() {
        return utilisateurRepository.count();
    }

    @Override
    public String getLastAccess() {
        Utilisateur last = utilisateurRepository.findTopByOrderByDerniereConnexionDesc();
        return last != null && last.getDerniereConnexion() != null ? last.getDerniereConnexion().toString() : "Aucune donnée";
    }
}
