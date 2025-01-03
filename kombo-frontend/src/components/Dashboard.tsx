import React, { useEffect, useState } from "react";
import { Company } from "../pages/Companies";
import "./Dashboard.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";

interface DashboardProps {
    company: Company | null;
}

interface EmployeesInformation {
    totalNumber: number;
    femaleNumber: number;
    maleNumber: number;
    genderRatio: number;
    age: AgeInformation;
}

interface AgeInformation {
    ageAverage: number;
    employeesOver61yearPercentage: number;
    employeesBetween21And30yearPercentage: number;
    employeesBetween31And40yearPercentage: number;
    employeesBetween41And50yearPercentage: number;
    employeesBetween51And60yearPercentage: number;
}

function Dashboard({ company }: DashboardProps) {
    const [employeesInfo, setEmployeesInfo] = useState<EmployeesInformation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const API_URL = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        if (company) {
            setLoading(true);
            axios
                .get(`${API_URL}/companies/${company.integrationId}/employees/summary`)
                .then((response) => {
                    setEmployeesInfo(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching employee summary:", error);
                    setLoading(false);
                });
        }
    }, [company]);

    if (!company) {
        return null; // Si aucune entreprise n'est sélectionnée, ne rien afficher
    }

    if (loading) {
        return <CircularProgress />;
    }

    if (!employeesInfo) {
        return <p>Aucune donnée disponible</p>;
    }

    return (
        <main className="dashboard">
            <h2>{company.companyName}</h2>
            <div className="dashboard-container">
                <div className="dashboard-section">
                    <h3>Total des effectifs</h3>
                    <p>
                        La société emploie {employeesInfo.femaleNumber} femmes et {employeesInfo.maleNumber} hommes,
                        soit {(employeesInfo.femaleNumber / employeesInfo.totalNumber) * 100}% d’effectif féminin.
                    </p>
                    <p>Total: {employeesInfo.totalNumber} employés</p>
                </div>

                <div className="dashboard-section">
                    <h3>Répartition par âge</h3>
                    <ul>
                        <li>21-30 ans : {employeesInfo.age.employeesBetween21And30yearPercentage}%</li>
                        <li>31-40 ans : {employeesInfo.age.employeesBetween31And40yearPercentage}%</li>
                        <li>41-50 ans : {employeesInfo.age.employeesBetween41And50yearPercentage}%</li>
                        <li>51-60 ans : {employeesInfo.age.employeesBetween51And60yearPercentage}%</li>
                        <li>Plus de 60 ans : {employeesInfo.age.employeesOver61yearPercentage}%</li>
                    </ul>
                </div>

                <div className="dashboard-section">
                    <h3>Âge moyen</h3>
                    <p>{employeesInfo.age.ageAverage} ans</p>
                </div>
            </div>
        </main>
    );
}

export default Dashboard;
