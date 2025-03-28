package fr.estia.dashboardtpi.services;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendAlertEmail(String to, String subject, String message) {
        try {
            MimeMessage mail = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mail, true);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message, false); // false = texte brut
            javaMailSender.send(mail);
        } catch (MessagingException e) {
            throw new RuntimeException("❌ Erreur lors de l'envoi de l'e-mail", e);
        }
    }
}
