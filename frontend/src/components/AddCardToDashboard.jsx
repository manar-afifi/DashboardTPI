import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const AddExistingCardToDashboard = () => {
    const [dashboardName, setDashboardName] = useState("");
    const [cardName, setCardName] = useState("");
    const [dashboards, setDashboards] = useState([]);
    const [cards, setCards] = useState([]);
    const [message, setMessage] = useState("");
    const [dashboardId, setDashboardId] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dashRes = await axios.get("http://localhost:8080/api/metabase/dashboards");
                const cardRes = await axios.get("http://localhost:8080/api/metabase/cards");
                setDashboards(dashRes.data);
                setCards(cardRes.data);
            } catch (error) {
                setMessage("❌ Erreur chargement : " + error.message);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("⏳ Ajout en cours...");

        try {
            const res = await axios.post("http://localhost:8080/api/metabase/add-existing-card-by-name", null, {
                params: { dashboardName, cardName },
            });
            setMessage("✅ " + res.data);

            const selectedDashboard = dashboards.find((d) => d.name === dashboardName);
            if (selectedDashboard) {
                setDashboardId(selectedDashboard.id);
                setRefreshKey(prev => prev + 1);
            }
        } catch (error) {
            setMessage("❌ Erreur : " + (error.response?.data || error.message));
        }
    };

    return (
        <div style={{
            background: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
            minHeight: "100vh",
            padding: "20px"
        }}>
            <div style={{
                maxWidth: '700px',
                margin: '100px auto 40px auto',
                background: 'white',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
                fontFamily: 'Arial, sans-serif',
                color: '#333'
            }}>

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
                            <li onClick={() => navigate("/add")}> Ajouter un graphique</li>
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
                </Topbar>

                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>➕ Ajouter une carte existante à un dashboard</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <select
                        value={dashboardName}
                        onChange={(e) => setDashboardName(e.target.value)}
                        required
                        style={inputStyle}
                    >
                        <option value="">-- Sélectionner un dashboard --</option>
                        {dashboards.map((d) => (
                            <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                    </select>

                    <select
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        required
                        style={inputStyle}
                    >
                        <option value="">-- Sélectionner une carte --</option>
                        {cards.map((c) => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>

                    <button type="submit" style={buttonStyle}>
                        Ajouter
                    </button>
                </form>

                {message && <p style={{ marginTop: '20px', fontSize: '14px', color: '#444' }}>{message}</p>}

                {dashboardId && (
                    <div style={{ marginTop: '30px' }}>
                        <h3 style={{ marginBottom: '10px', fontWeight: '600' }}>Dashboard : {dashboardName}</h3>
                        <button
                            onClick={() => setRefreshKey(prev => prev + 1)}
                            style={refreshButtonStyle}
                        >🔁 Rafraîchir le dashboard</button>

                        <iframe
                            key={refreshKey}
                            title="Dashboard Iframe"
                            src={`http://localhost:3000/public/dashboard/${dashboardId}`}
                            width="100%"
                            height="600"
                            frameBorder="0"
                            allowTransparency="true"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '14px'
};

const buttonStyle = {
    backgroundColor: '#6a11cb',
    backgroundImage: 'linear-gradient(315deg, #6a11cb 0%, #2575fc 74%)',
    color: 'white',
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer'
};

const refreshButtonStyle = {
    marginBottom: '10px',
    padding: '8px 14px',
    fontSize: '14px',
    backgroundColor: '#eee',
    borderRadius: '8px',
    border: '1px solid #ccc',
    cursor: 'pointer'
};

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
export default AddExistingCardToDashboard;