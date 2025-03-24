import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const MetabaseViewer = () => {
    const [dashboards, setDashboards] = useState([]);
    const [selectedDashboard, setSelectedDashboard] = useState("");
    const [iframeUrl, setIframeUrl] = useState("");
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetchDashboards();
    }, []);

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
                                        {" "}
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

// STYLES
const Container = styled.div`
    min-height: 100vh;
    padding: 40px 20px;
    background: linear-gradient(135deg, #0d0d0d, #3e0231);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 2rem;
    margin-bottom: 20px;
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

