import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlertRules = () => {
    const [rules, setRules] = useState([]);
    const [cards, setCards] = useState([]);
    const [newRule, setNewRule] = useState({
        name: '',
        cardId: '',
        metric: '',
        condition: '>',
        threshold: 0,
        notificationMessage: '',
        additionalParams: {}
    });

    const backendUrl = "http://localhost:8080";

    useEffect(() => {
        fetchRules();
        fetchCards();
    }, []);

    const fetchRules = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/alert-rules/my-rules`);
            setRules(res.data);
        } catch (err) {
            console.error("❌ Erreur chargement règles", err);
        }
    };

    const fetchCards = async () => {
        try {
            const res = await axios.get(`${backendUrl}/api/metabase/cards`);
            setCards(res.data);
        } catch (err) {
            console.error("❌ Erreur chargement cartes", err);
        }
    };

    const createRule = async () => {
        try {
            await axios.post(`${backendUrl}/api/alert-rules`, newRule);
            alert("✅ Règle enregistrée !");
            fetchRules();
        } catch (err) {
            console.error("❌ Erreur création règle", err);
        }
    };

    return React.createElement("div", {
            className: "container",
            style: {
                maxWidth: '700px',
                margin: '30px auto',
                background: 'linear-gradient(135deg, #e0c3fc, #8ec5fc)',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }
        },
        React.createElement("h2", { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' } }, "🔔 Créer une Alerte"),
        React.createElement("p", { style: { color: '#666', marginBottom: '25px' } }, "Remplissez le formulaire pour définir une nouvelle règle d'alerte."),

        React.createElement("input", {
            type: "text",
            placeholder: "Nom de la règle",
            value: newRule.name,
            onChange: e => setNewRule({ ...newRule, name: e.target.value }),
            style: inputStyle
        }),

        React.createElement("select", {
                value: newRule.cardId,
                onChange: e => setNewRule({ ...newRule, cardId: e.target.value }),
                style: inputStyle
            },
            React.createElement("option", { value: "" }, "-- Sélectionner une carte --"),
            cards.map(card =>
                React.createElement("option", { key: card.id, value: card.id }, card.name)
            )
        ),

        React.createElement("input", {
            type: "text",
            placeholder: "Champ à surveiller (ex: montant_total)",
            value: newRule.metric,
            onChange: e => setNewRule({ ...newRule, metric: e.target.value }),
            style: inputStyle
        }),

        React.createElement("div", {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    marginBottom: '15px'
                }
            },
            React.createElement("select", {
                    value: newRule.condition,
                    onChange: e => setNewRule({ ...newRule, condition: e.target.value }),
                    style: inputStyle
                },
                React.createElement("option", { value: ">" }, "Supérieur à"),
                React.createElement("option", { value: "<" }, "Inférieur à"),
                React.createElement("option", { value: "==" }, "Égal à")
            ),
            React.createElement("input", {
                type: "number",
                value: newRule.threshold,
                onChange: e => setNewRule({ ...newRule, threshold: parseFloat(e.target.value) }),
                style: inputStyle
            })
        ),

        React.createElement("input", {
            type: "text",
            placeholder: "Message d’alerte",
            value: newRule.notificationMessage,
            onChange: e => setNewRule({ ...newRule, notificationMessage: e.target.value }),
            style: inputStyle
        }),

        React.createElement("button", {
            onClick: createRule,
            style: {
                backgroundColor: '#7c3aed',
                color: 'white',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                marginTop: '10px'
            }
        }, "📩 Créer l’alerte"),

        React.createElement("hr", { style: { margin: '30px 0' } }),

        React.createElement("h3", { style: { fontSize: '20px', fontWeight: '600', marginBottom: '15px' } }, "📋 Mes Règles enregistrées"),
        rules.length > 0 ? (
            rules.map(rule =>
                React.createElement("div", {
                        key: rule.id,
                        style: {
                            backgroundColor: '#f9f9f9',
                            borderLeft: '4px solid #7c3aed',
                            padding: '15px',
                            marginBottom: '10px',
                            borderRadius: '10px'
                        }
                    },
                    React.createElement("strong", null, "🔔 ", rule.name),
                    React.createElement("p", { style: { fontSize: '14px', margin: '4px 0', color: '#444' } },
                        `${rule.metric} ${rule.condition} ${rule.threshold}`),
                    React.createElement("p", { style: { fontSize: '14px', color: '#6b21a8' } },
                        `📩 ${rule.notificationMessage}`)
                )
            )
        ) : (
            React.createElement("p", {
                style: { fontStyle: 'italic', color: '#888' }
            }, "Aucune règle encore enregistrée.")
        )
    );
};

const inputStyle = {
    width: '100%',
    padding: '12px',
    marginBottom: '20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box'
};


export default AlertRules;
