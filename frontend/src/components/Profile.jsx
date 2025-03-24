import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa"; // Icône utilisateur par défaut

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Récupérer l'utilisateur depuis localStorage
    const storedUser = localStorage.getItem("user");
    const userId = storedUser ? JSON.parse(storedUser).idUtilisateur : null;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/utilisateurs/${userId}`);
                setUser(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement du profil :", error);
            }
        };

        if (userId) {
            fetchUser();
        } else {
            navigate("/login");
        }
    }, [navigate, userId]);

    if (!user) {
        return <Loading>Chargement...</Loading>;
    }

    return (
        <PageWrapper>
        <ProfileContainer>
            <ProfileCard>
                <ProfileLeft>
                    {user.photoUtilisateur ? (
                        <ProfileImage src={`data:image/png;base64,${user.photoUtilisateur}`} alt="Avatar" />
                    ) : (
                        <DefaultProfileIcon />
                    )}
                </ProfileLeft>
                <ProfileRight>
                    <h2>Profil de {user.nomUtilisateur}</h2>

                    {/* ✅ Affichage des informations sous forme de champs */}
                    <Form>
                        <Label>Nom :</Label>
                        <Input type="text" value={user.nomUtilisateur} disabled />

                        <Label>Email :</Label>
                        <Input type="email" value={user.email} disabled />

                        <Label>Mot de passe :</Label>
                        <Input type="password" value={user.motDepasse} disabled />

                        <Label>Rôle :</Label>
                        <Input type="text" value="Administrateur" disabled />
                    </Form>

                    {/* ✅ Espacement amélioré entre les boutons */}
                    <ButtonContainer>
                        <Button onClick={() => navigate("/edit-profile")}>Modifier mon profil</Button>
                        <Button onClick={() => navigate("/dashboard")}>Retour au Dashboard</Button>
                    </ButtonContainer>
                </ProfileRight>
            </ProfileCard>
        </ProfileContainer>
        </PageWrapper>
    );
};

export default Profile;

// 🌟 STYLED COMPONENTS 🌟

const ProfileContainer = styled.div`
    max-width: 800px;
    margin: 50px auto;
    padding: 30px;
    border-radius: 15px;
    background: #ffffff;
    color: #333;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
`;

const ProfileCard = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    flex-wrap: wrap;
`;

const ProfileLeft = styled.div`
    width: 150px;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ddd;
`;

const DefaultProfileIcon = styled(FaUserCircle)`
    font-size: 150px;
    color: #ccc;
`;

const ProfileRight = styled.div`
    flex: 1;
`;

const Form = styled.div`
    
    flex-direction: column;
    gap: 10px;
    background: #f8f8f8;
    padding: 15px;
    border-radius: 10px;
    margin-top: 10px;
`;

const Label = styled.label`
    font-weight: bold;
    color: #444;
`;

const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: #fff;
    font-size: 1rem;
    width: 96%;
    color: #555;
    &:disabled {
        background: #eee;
        color: #888;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 15px;  /* 🔥 ✅ Augmente l’espace entre les boutons */
    margin-top: 20px;
    justify-content: center;
`;

const Button = styled.button`
    background-color: #4e0453;
    color: white;
    padding: 12px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    flex: 1;
    text-align: center;
    transition: background 0.3s ease, transform 0.2s ease;

    &:hover {
        background-color: #77096e;
        transform: translateY(-2px);
    }
`;

const Loading = styled.div`
    font-size: 1.5rem;
    color: #333;
    text-align: center;
    margin-top: 50px;
`;
const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #330125, #000000);
    color: white;
    height: 100vh;
    
`;

