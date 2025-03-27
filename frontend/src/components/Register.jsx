import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import backgroundImage from "../assets/img_6.png";

const Register = () => {
    const [nom, setNom] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = {
            nomUtilisateur: nom,
            email: email,
            motDepasse: password
        };


        try {
            const response = await fetch("http://localhost:8080/api/utilisateurs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error("Échec de l'inscription");
            }

            const data = await response.json();
            alert(`Compte créé pour ${data.nom} !`);
            navigate("/login");
        } catch (error) {
            console.error("Erreur lors de l'inscription :", error);
            alert("Erreur lors de la création du compte !");
        }
    };


    return (
        <Container>
            <FormBox>
                <Title> Créer un compte</Title>
                <Form onSubmit={handleRegister}>
                    <Input
                        type="text"
                        placeholder="Nom d'utilisateur"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">🚀 S'inscrire</Button>
                </Form>
                <Text>
                    Déjà inscrit ?{" "}
                    <LoginLink onClick={() => navigate("/login")}>Se connecter</LoginLink>
                </Text>
            </FormBox>
        </Container>
    );
};

export default Register;


const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url(${backgroundImage}) center/cover no-repeat;
    position: relative;

    &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(5px); /* Flou dynamique */
        background: rgba(0, 0, 0, 0.6);
    }
`;

const FormBox = styled.div`
    width: 400px;
    padding: 30px;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    border-radius: 15px;
    box-shadow: 0px 4px 20px rgba(255, 5, 251, 0.5);
    text-align: center;
    color: white;
    z-index: 1;
    animation: ${fadeIn} 0.8s ease-in-out;
`;

const Title = styled.h2`
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 20px;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Input = styled.input`
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    width: 95%;
    outline: none;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    transition: 0.3s ease-in-out;
    border: 1px solid transparent;

    &::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }

    &:focus {
        border: 1px solid #00d4ff;
        background: rgba(255, 255, 255, 0.3);
        box-shadow: 0px 0px 10px #00d4ff;
    }
`;

const Button = styled.button`
    background: linear-gradient(90deg, #007bff, #e008ef);
    color: white;
    padding: 14px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: bold;
    transition: 0.3s ease-in-out;
    width: 100%;
    box-shadow: 0px 0px 10px rgba(0, 173, 255, 0.5);

    &:hover {
        background: linear-gradient(90deg, #7100b3, #de07f6);
        transform: scale(1.02);
    }
`;

const Text = styled.p`
    margin-top: 15px;
    font-size: 1rem;
`;

const LoginLink = styled.span`
    color: #00d4ff;
    cursor: pointer;
    font-weight: bold;
    transition: 0.3s;

    &:hover {
        text-decoration: underline;
    }
`;
