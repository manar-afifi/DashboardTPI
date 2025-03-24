import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CardViewer = () => {
    const { cardId } = useParams();
    const [iframeUrl, setIframeUrl] = useState("");

    useEffect(() => {
        const fetchCardUrl = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/metabase/card-url/${cardId}`);
                setIframeUrl(res.data);
            } catch (error) {
                console.error("Erreur récupération URL carte :", error);
            }
        };

        fetchCardUrl();
    }, [cardId]);

    return (
        <div>
            <h2>📊 Carte #{cardId}</h2>
            {iframeUrl && (
                <iframe
                    src={iframeUrl}
                    width="100%"
                    height="700"
                    frameBorder="0"
                    title={`Carte ${cardId}`}
                ></iframe>
            )}
        </div>
    );
};

export default CardViewer;
