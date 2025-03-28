package fr.estia.dashboardtpi.config;/*package fr.estia.dashboardtpi.config;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers("/api/auth/**").permitAll() // Permet l'authentification
                .requestMatchers("/api/admin/**").hasRole("ADMIN") // Seulement les ADMIN
                .anyRequest().authenticated()
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}*/

/*
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // Bean pour hacher le mot de passe
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Configuration de Spring Security
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()  // Désactive la protection CSRF (optionnel si on utilise JWT)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/api/utilisateurs/register", "/api/utilisateurs/login").permitAll()  // Accès public pour les routes d'authentification et d'inscription
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")  // Accès réservé aux administrateurs
                        .anyRequest().permitAll()  // Toutes les autres routes nécessitent une authentification
                )
                .formLogin().disable()  // Désactive le formulaire de connexion par défaut
                .httpBasic().disable(); // Désactive l'authentification HTTP Basic (car nous utilisons JWT)

        return http.build();
    }
}*/



