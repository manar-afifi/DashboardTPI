import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const MetabaseViewer = () => {
    const location = useLocation();
    const passedDashboardId = location.state?.dashboardId || "";
    const [dashboards, setDashboards] = useState([]);
    const [selectedDashboard, setSelectedDashboard] = useState(passedDashboardId);
    const [iframeUrl, setIframeUrl] = useState("");
    const [cards, setCards] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboards();
    }, []);

    useEffect(() => {
        if (passedDashboardId) {
            handleSelect(passedDashboardId);
        }
    }, [passedDashboardId]);

    const fetchDashboards = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/metabase/dashboards");
            setDashboards(res.data);
        } catch (err) {
            console.error("Erreur chargement dashboards", err);
        }
    };

    const handleSelect = async (id) => {
        setSelectedDashboard(id);
        try {
            const res = await axios.get(`http://localhost:8080/api/metabase/dashboard-url/${id}`);
            setIframeUrl(res.data);

            const cardsRes = await axios.get(`http://localhost:8080/api/metabase/cards`);
            setCards(cardsRes.data);
        } catch (error) {
            console.error("❌ Erreur récupération dashboard ou cartes :", error);
        }
    };

    const handlePublishAll = async () => {
        try {
            await axios.post("http://localhost:8080/api/metabase/publish-all-cards");
            alert("✅ Toutes les cartes ont été publiées avec succès !");
        } catch (err) {
            console.error("❌ Erreur publication des cartes", err);
            alert("Erreur lors de la publication.");
        }
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen}>
                <SidebarContent>
                    <CloseButton onClick={() => setSidebarOpen(false)}>✖</CloseButton>
                    <h2>Menu</h2>
                    <ul>
                        <li onClick={() => navigate("/")}>🏠 Accueil</li>
                        <li onClick={() => navigate("/dashboard")}> Vue d’ensemble</li>
                        <li onClick={() => navigate("/upload")}> Importer des données</li>
                        <li onClick={() => navigate("/generate-kpi")}> 📊 Générer les KPI</li>
                        <li onClick={() => navigate("/metabase")}> ➕ Nouvelle question</li>
                        <li onClick={() => navigate("/metabase-viewer")}> Visualiser les dashboards</li>
                        <li onClick={() => navigate("/profile")}>👤 Profil</li>
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
            <Topbar>
                <LeftSection>
                    <BurgerIcon onClick={() => setSidebarOpen(!sidebarOpen)}>☰</BurgerIcon>
                </LeftSection>
                <RightSection>
                    <Notification>🔔</Notification>
                    <ProfileIcon>👤</ProfileIcon>
                </RightSection>
            </Topbar>
            <h2>🔎 Rechercher un Dashboard Metabase</h2>

            <Button onClick={handlePublishAll}>📢 Publier toutes les cartes</Button>

            <Select onChange={(e) => handleSelect(e.target.value)} value={selectedDashboard}>
                <option value="">-- Sélectionner un dashboard --</option>
                {dashboards.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                ))}
            </Select>

            {iframeUrl && (
                <>
                    <IframeWrapper>
                        <iframe
                            src={iframeUrl}
                            title="Metabase Dashboard"
                            width="100%"
                            height="700"
                            frameBorder="0"
                            allowFullScreen
                        ></iframe>
                    </IframeWrapper>

                    {cards.length > 0 && (
                        <CardList>
                            <h3>🧠 Cartes associées :</h3>
                            <ul>
                                {cards.map((card) => (
                                    <li key={card.id}>
                                        <a href={`/card/${card.id}`} target="_blank" rel="noopener noreferrer">
                                            📄 {card.name || `Carte #${card.id}`}
                                        </a>{" "}
                                        <a href={`/explorer/${card.id}`} target="_blank" rel="noopener noreferrer">
                                            🔍 Explorer
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </CardList>
                    )}
                </>
            )}
        </Container>
    );
};

export default MetabaseViewer;

const Container = styled.div`
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #0d0d0d, #3e0231);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Select = styled.select`
    margin-top: 20px;
    padding: 12px 20px;
    font-size: 1rem;
    width: 100%;
    max-width: 600px;
    border-radius: 8px;
    border: none;
    outline: none;
`;

const Button = styled.button`
    margin-top: 15px;
    padding: 12px 24px;
    font-size: 1.1rem;
    background-color: #c612b8;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: #4a043f;
        transform: scale(1.03);
    }
`;

const IframeWrapper = styled.div`
    margin-top: 30px;
    width: 100%;
    max-width: 1100px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0,0,0,0.4);

    iframe {
        width: 100%;
        height: 700px;
        border: none;
    }
`;

const CardList = styled.div`
    margin-top: 40px;
    background: #1a1a1a;
    padding: 25px;
    border-radius: 12px;
    max-width: 1100px;
    width: 100%;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);

    h3 {
        color: #f9f9f9;
        margin-bottom: 15px;
        font-size: 1.5rem;
    }

    ul {
        list-style: none;
        padding: 0;
        max-height: 300px; /* Limite la hauteur visible */
        overflow-y: auto;   /* Permet de défiler verticalement */
        padding-right: 10px;
    }

    li {
        padding: 10px 0;
        border-bottom: 1px solid #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;

        a {
            color: #61dafb;
            text-decoration: none;
            font-weight: 500;

            &:hover {
                text-decoration: underline;
                color: #00cfff;
            }
        }
    }
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
