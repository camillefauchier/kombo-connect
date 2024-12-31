import React from "react";
import {Company} from "../pages/Companies";
import "../App.css"

interface DashboardProps {
    company: Company | null;
}
function Dashboard({ company }: DashboardProps) {
    if (!company) {
        return null; // Si aucune entreprise n'est sélectionnée, ne rien afficher
    }

    return (
        <main className="dashboard">
            <h2>{company.name}</h2>
        </main>
    );
}

export default Dashboard;
