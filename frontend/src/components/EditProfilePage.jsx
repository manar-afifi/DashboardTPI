import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { FaUserCircle, FaSave, FaTimes } from "react-icons/fa"; // Icônes

export default function EditProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setNewName(parsedUser.nomUtilisateur);
            setNewEmail(parsedUser.email);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        const formData = new FormData();
        formData.append("newName", newName);
        formData.append("newEmail", newEmail);
        if (selectedFile) {
            formData.append("file", selectedFile);
        }

        try {
            const response = await axios.put(
                `http://localhost:8080/api/utilisateurs/${user.idUtilisateur}/update`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            const updatedUser = response.data;
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert("Profil mis à jour avec succès !");
            navigate("/profile");
        } catch (error) {
            console.error("Erreur lors de la mise à jour du profil :", error.response?.data || error);
            alert("Échec de la mise à jour du profil.");
        }
    };

    if (!user) {
        return <Loading>Chargement...</Loading>;
    }

    return (
        <ProfileContainer>
            <ProfileCard>
                <ProfileLeft>
                    <ProfileImageContainer>
                        {previewImage ? (
                            <ProfileImage src={previewImage} alt="Nouvelle photo" />
                        ) : user.photoUtilisateur ? (
                            <ProfileImage src={`data:image/png;base64,${user.photoUtilisateur}`} alt="Photo actuelle" />
                        ) : (
                            <DefaultProfileIcon />
                        )}
                    </ProfileImageContainer>
                    <FileLabel>
                        📁 Choisir un fichier
                        <FileInput type="file" accept="image/*" onChange={handleFileChange} />
                    </FileLabel>
                </ProfileLeft>

                <ProfileRight>
                    <h2>Modifier le Profil</h2>
                    <ProfileForm onSubmit={handleUpdateProfile}>
                        <Label>Nom d'utilisateur :</Label>
                        <Input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />

                        <Label>Email :</Label>
                        <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />

                        <ButtonGroup>
                            <SaveButton type="submit">
                                <FaSave /> Enregistrer
                            </SaveButton>
                            <CancelButton onClick={() => navigate("/profile")}>
                                <FaTimes /> Annuler
                            </CancelButton>
                        </ButtonGroup>
                    </ProfileForm>
                </ProfileRight>
            </ProfileCard>
        </ProfileContainer>
    );
}

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
    flex-wrap: wrap;
    padding: 20px;
`;

const ProfileLeft = styled.div`
    width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProfileImageContainer = styled.div`
    width: 140px;
    height: 140px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 4px solid #ddd;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const ProfileImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

const DefaultProfileIcon = styled(FaUserCircle)`
    font-size: 140px;
    color: #ccc;
`;

const ProfileRight = styled.div`
    flex: 1;
`;

const ProfileForm = styled.form`
    display: flex;
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
`;

const FileLabel = styled.label`
    background: #eee;
    padding: 8px 12px;
    font-size: 0.9rem;
    border-radius: 5px;
    margin-top: 10px;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;
    &:hover {
        background: #ddd;
    }
`;

const FileInput = styled.input`
    display: none;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 15px;
`;

const SaveButton = styled.button`
    flex: 1;
    background-color: #1db954;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    transition: background 0.3s ease;

    &:hover {
        background-color: #14833b;
    }
`;

const CancelButton = styled(SaveButton)`
    background-color: #ff4d4d;

    &:hover {
        background-color: #cc0000;
    }
`;

const Loading = styled.div`
    font-size: 1.5rem;
    color: #333;
    text-align: center;
    margin-top: 50px;
`;
