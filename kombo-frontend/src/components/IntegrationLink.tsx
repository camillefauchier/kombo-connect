import React, { useState } from "react";
import { FaCopy } from "react-icons/fa";
import "./IntegrationLink.css";

interface IntegrationLinkProps {
    integrationLink: string;
}

const IntegrationLink: React.FC<IntegrationLinkProps> = ({ integrationLink }) => {
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(integrationLink);
            setCopySuccess("Lien copié !");
            setTimeout(() => setCopySuccess(null), 2000); // Effacer le message après 2 secondes
        } catch (err) {
            console.error("Erreur lors de la copie du lien : ", err);
            setCopySuccess("Erreur lors de la copie !");
        }
    };

    return (
        <div className="integration-link-container">
            <div className="integration-link-box">
                <p>{integrationLink}</p>
                <FaCopy
                    className="copy-icon"
                    onClick={handleCopy}
                    title="Cliquez pour copier"
                />
            </div>
            {copySuccess && <p className="copy-success">{copySuccess}</p>}
        </div>
    );
};

export default IntegrationLink;
