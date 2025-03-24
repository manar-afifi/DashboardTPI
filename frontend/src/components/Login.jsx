import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import backgroundImage from "../assets/img_6.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, motDePasse: password })
            });


            if (!response.ok) {
                throw new Error("Email ou mot de passe incorrect !");
            }

            const data = await response.json(); // Récupère le token renvoyé par le backend
            localStorage.setItem("token", data.token); // Stocker le token JWT
            localStorage.setItem("user", JSON.stringify({
                idUtilisateur: data.idUtilisateur,
                nomUtilisateur: data.nomUtilisateur,
                email: data.email
            }));
            console.log("Utilisateur connecté :", localStorage.getItem("user"));
            navigate("/dashboard"); // Redirection après connexion

        } catch (error) {
            console.error("Erreur lors de la connexion :", error);
            alert(error.message); // Afficher l'erreur si le login échoue
        }
    };

    return (
        <Container>
            {/* Section gauche avec l'image agrandie */}
            <LeftSection>
                <OverlayText>
                    <h1>Créez des Dashboards Visuellement Impactants</h1>
                    <p>
                        Générez des tableaux de bord dynamiques, visualisez vos données en temps réel et construisez des cartes interactives en quelques clics ✨
                    </p>
                </OverlayText>
            </LeftSection>



            {/* Section droite avec le formulaire */}
            <RightSection>
                <LoginBox>
                    <Logo>🔥 C'est parti !</Logo>
                    <h2>Connexion</h2>
                    <Form onSubmit={handleLogin}>
                        <Label>Adresse e-mail</Label>
                        <Input
                            type="email"
                            placeholder="Entrez votre adresse e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Label>Définir le mot de passe</Label>
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Entrer le mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <CheckboxContainer>
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                            />
                            <span>Afficher le mot de passe</span>
                        </CheckboxContainer>
                        <Button type="submit">🚀 Se connecter</Button>
                    </Form>

                    <Divider>Ou</Divider>

                    <SignupButton onClick={() => navigate("/register")}>
                        S'inscrire
                    </SignupButton>
                </LoginBox>
            </RightSection>
        </Container>
    );
};

export default Login;

// 🌟 STYLES 🌟
const Container = styled.div`
    display: flex;
    height: 100vh;
    background: #010315;
`;

const LeftSection = styled.div`
    flex: 1.95;
    position: relative;
    background: url(${backgroundImage}) center center no-repeat;
    background-size: contain;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #010413;
    overflow: hidden;
`;
const OverlayText = styled.div`
  position: absolute;
  top: 80px;
  left: 80px;
  max-width: 500px;

  h1 {
    font-size: 2.5rem;
    font-weight: 800;
    color: #f472d0;
    margin-bottom: 10px;
    line-height: 1.3;
    text-shadow: 2px 2px 6px #000;
  }

  p {
    font-size: 1.15rem;
    font-weight: 400;
    color: #f9fafb;
    line-height: 1.6;
    text-shadow: 1px 1px 4px #000;
  }

  @media (max-width: 768px) {
    top: 40px;
    left: 20px;
    h1 {
      font-size: 1.8rem;
    }
    p {
      font-size: 1rem;
    }
  }
`;




const RightSection = styled.div`
    flex: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const glow = keyframes`
    0% {
        box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.3);
    }
    50% {
        box-shadow: 0px 0px 20px rgb(216, 15, 199);
    }
    100% {
        box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.3);
    }
`;

const LoginBox = styled.div`
    width: 380px;
    padding: 30px;
    background: rgba(20, 20, 20, 0.9);
    box-shadow: 0px 4px 10px rgb(155, 47, 147);
    backdrop-filter: blur(5px);
    text-align: center;
    border-radius: 12px;
    color: white;
    animation: ${glow} 3s infinite alternate;
`;

const Logo = styled.div`
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Label = styled.label`
    font-size: 0.9rem;
    color: #ddd;
    text-align: left;
`;

const Input = styled.input`
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    width: 94%;
    outline: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }

    &:focus {
        border: 1px solid #00ff04;
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0px 0px 10px #0ae83e;
    }
`;

const CheckboxContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 0.9rem;
    color: #ddd;
    margin: 10px 0;
`;

const Button = styled.button`
    background: #001f3f;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: 0.3s;
    width: 100%;

    &:hover {
        background: #003366;
    }
`;

const Divider = styled.p`
    margin: 15px 0;
    font-size: 0.9rem;
    color: #ddd;
`;

const SignupButton = styled(Button)`
    background: linear-gradient(90deg, #9a2e91, #1580f8);
    color: white;

    &:hover {
        background: #993095;
    }
`;

