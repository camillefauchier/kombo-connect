import React, { useState } from "react";
import axios from "axios";
import IntegrationLink from "./IntegrationLink";

function Integration() {
    const [companyName, setCompanyName] = useState("");
    const [email, setEmail] = useState("");
    const [integrationLink, setIntegrationLink] = useState("");
    const [copySuccess, setCopySuccess] = useState("");
    const API_URL = process.env.REACT_APP_BACKEND_URL;


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/companies/integration`, {
                companyName,
                email,
            });
            setIntegrationLink(response.data.link); // Stocke le lien d'intégration
            setCopySuccess(""); // Réinitialise le message de copie
        } catch (error) {
            console.error("Erreur lors de la création du lien :", error);
        }
    };

    const handleCopy = () => {
        if (integrationLink) {
            navigator.clipboard.writeText(integrationLink); // Copie le lien dans le presse-papiers
            setCopySuccess("Lien copié dans le presse-papiers !");
        }
    };

    return (
        <div className="integration-page">
            <h1>Créer un lien d'intégration</h1>
            <form onSubmit={handleSubmit} className="integration-form">
                <div className="form-group">
                    <label htmlFor="companyName">Nom de l'entreprise</label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{width:"100%"}}>Créer le lien d'intégration</button>
            </form>

            {integrationLink && (
                <IntegrationLink integrationLink={integrationLink}/>
            )}
        </div>
    );
}

export default Integration;
