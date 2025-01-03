import React, { useEffect, useState } from "react";
import { Company } from "../pages/Companies";
import "./Dashboard.css";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from "recharts";
import HierarchyChart from "./HierarchyChart";

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

const COLORS = ["#fff7cb", "#ffeb83", "#FFD700", "#FFC700", "#FFB800", "#D5D3D3", "#D5D3D3"];

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


    // @ts-ignore
    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, name,}) => {
        const RADIAN = Math.PI / 180;

        // Calculate the position for the percentage (inside the segment)
        const innerRadiusPosition = innerRadius + (outerRadius - innerRadius) * 0.5;
        const xPercentage = cx + innerRadiusPosition * Math.cos(-midAngle * RADIAN);
        const yPercentage = cy + innerRadiusPosition * Math.sin(-midAngle * RADIAN);

        // Calculate the position for the name (outside the chart)
        const labelRadius = outerRadius + 20;
        const xName = cx + labelRadius * Math.cos(-midAngle * RADIAN);
        const yName = cy + labelRadius * Math.sin(-midAngle * RADIAN);

        return (
            <>
                {/* Percentage inside the colored segment */}
                <text
                    x={xPercentage}
                    y={yPercentage}
                    fill="black"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                >
                    {`${(percent * 100).toFixed(1)}%`}
                </text>

                {/* Name at the end of the line */}
                <text
                    x={xName}
                    y={yName}
                    fill="black"
                    textAnchor={xName > cx ? "start" : "end"}
                    dominantBaseline="central"
                    fontSize={12}
                    style={{margin: "3px"}}
                >
                    {name}
                </text>
            </>
        );
    };


    if (!company) {
        return null; // Si aucune entreprise n'est sélectionnée, ne rien afficher
    }

    if (loading || !employeesInfo ) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100%"// Prend toute la hauteur de la fenêtre
                }}
            >
                <CircularProgress />
            </div>
        );
    }


    const ageData = [
        { name: "21-30 ans", value: employeesInfo.age.employeesBetween21And30yearPercentage },
        { name: "31-40 ans", value: employeesInfo.age.employeesBetween31And40yearPercentage },
        { name: "41-50 ans", value: employeesInfo.age.employeesBetween41And50yearPercentage },
        { name: "51-60 ans", value: employeesInfo.age.employeesBetween51And60yearPercentage },
        { name: "Plus de 60 ans", value: employeesInfo.age.employeesOver61yearPercentage },
    ];

    const genderData = [
        { name: "Femmes", value: employeesInfo.femaleNumber },
        { name: "Hommes", value: employeesInfo.maleNumber },
    ];

    return ( <main className="dashboard">
            <h2>{company.companyName}</h2>
            <div className="dashboard-container">
                {/* Graphique Répartition par Âge */}
                <div className="dashboard-chart">
                    <h3>Répartition par âge</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={ageData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={50}
                                outerRadius={100}
                                cx="50%"
                                cy="50%"
                                fill="#8884d8"
                                label={renderCustomizedLabel}
                            >
                                {ageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique Répartition par Genre */}
                <div className="dashboard-chart">
                    <h3>Répartition par genre</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={genderData}
                                label={renderCustomizedLabel}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={100}
                                fill="#82ca9d"
                            >
                                {genderData.map((entry, index) => (
                                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    {company.companyName} emploie {employeesInfo.femaleNumber} femmes et {employeesInfo.maleNumber} hommes
                </div>
            </div>
            <div style={{ width: "100%", height: "fit-content" }}>
                <HierarchyChart company={company} />
            </div>
        </main>
    );
}

export default Dashboard;
