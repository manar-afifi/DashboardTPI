import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

const Dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser) {
            navigate("/login");
        } else {
            const parsedUser = JSON.parse(storedUser);
            const userId = parsedUser?.idUtilisateur;

            if (userId) {
                axios
                    .get(`http://localhost:8080/api/utilisateurs/${userId}`)
                    .then((response) => setUser(response.data))
                    .catch((error) =>
                        console.error("Erreur lors du chargement du profil :", error)
                    );
            }
        }
    }, [navigate]);

    return (
        <Container>
            {/* SIDEBAR */}
            <Sidebar open={sidebarOpen}>
                <SidebarContent>
                    <CloseButton onClick={() => setSidebarOpen(false)}>✖</CloseButton>
                    <h2>Menu</h2>
                    <ul>
                        <li onClick={() => navigate("/")}>🏠 Accueil</li>
                        <li onClick={() => navigate("/profile")}>👤 Profil</li>
                        <li onClick={() => navigate("/upload")}> 📊 Data</li>
                        <li onClick={() => navigate("/metabase")}> Poser une question</li>
                        <li onClick={() => navigate("/metabase-viewer")}> Visualiser les dashboards</li>
                        <li
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/login");
                            }}
                        >
                            🚪 Déconnexion
                        </li>
                    </ul>
                </SidebarContent>
            </Sidebar>

            {/* TOPBAR */}
            <Topbar>
                <LeftSection>
                    <BurgerIcon onClick={() => setSidebarOpen(!sidebarOpen)}>☰</BurgerIcon>
                </LeftSection>

                <CenterSection>
                    <SearchInput
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </CenterSection>

                <RightSection>
                    <Notification>🔔</Notification>
                    <ProfileIcon>👤</ProfileIcon>
                </RightSection>
            </Topbar>

            {/* CONTENU */}
            <Title> Salutations,{user ? user.nomUtilisateur : "Chargement..."} !</Title>
            <Message>
                Bienvenue sur votre tableau de bord
            </Message>
        </Container>
    );
};

export default Dashboard;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #330125, #000000);
    color: white;
    height: 100vh;
    padding: 20px;
`;

const Sidebar = styled.div`
    position: fixed;
    top: 0;
    left: ${(props) => (props.open ? "0" : "-250px")};
    width: 250px;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    transition: 0.3s ease;
    z-index: 20;
    color: white;
`;

const SidebarContent = styled.div`
    padding: 20px;
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        padding: 15px;
        cursor: pointer;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    li:hover {
        background: rgba(255, 255, 255, 0.2);
    }
`;

const CloseButton = styled.div`
    text-align: right;
    cursor: pointer;
    font-size: 20px;
`;

const Topbar = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    z-index: 15;
`;

const LeftSection = styled.div`
    display: flex;
    align-items: center;
`;

const BurgerIcon = styled.div`
    font-size: 26px;
    cursor: pointer;
    color: white;
`;

const CenterSection = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
`;

const SearchInput = styled.input`
    padding: 8px 20px;
    border-radius: 20px;
    border: none;
    outline: none;
    font-size: 15px;
    width: 300px;
`;

const RightSection = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`;

const Notification = styled.div`
    font-size: 22px;
    cursor: pointer;
    
`;

const ProfileIcon = styled.div`
    font-size: 22px;
    cursor: pointer;
`;

const Title = styled.h1`
    font-size: 2rem;
    margin-top: 80px;
    margin-bottom: 10px;
`;

const Message = styled.p`
    font-size: 1.2rem;
    color: #ccc;
`;
