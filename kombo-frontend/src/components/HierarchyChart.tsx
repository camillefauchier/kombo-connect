import React, { useEffect, useState } from "react";
import { OrganizationChart } from "primereact/organizationchart";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {Company} from "../pages/Companies";
import axios from "axios";

type EmployeeHierarchicalInfo = {
    id: number;
    name: string;
    manager_id: number | null;
    job_title: string;
};

type HierarchyNode = {
    name: string;
    job_title: string;
    expanded: boolean; // Ajout d'expanded
    children: HierarchyNode[];
};

interface HierarchyChartProps {
    company: Company;
}

const HierarchyChart: React.FC<HierarchyChartProps> = ({ company }) => {
    const [employees, setEmployees] = useState<EmployeeHierarchicalInfo[] | null>(null);
    const [hierarchy, setHierarchy] = useState<HierarchyNode[]>([]);
    const API_URL = process.env.REACT_APP_KOMBO_BACKEND_URL;

    useEffect(() => {
        if (!company) {
            console.error("No company selected");
            return;
        }

        // Appel à l'API pour récupérer les données
        axios
            .get(`${API_URL}/companies/${company.integrationId}/management/summary`)
            .then((response) => {
                if (Array.isArray(response.data)) {
                    setEmployees(response.data);

                    // Construire la hiérarchie et mettre à jour l'état
                    const hierarchyData = buildHierarchy(response.data);
                    if (hierarchyData.length > 0) {
                        setHierarchy(hierarchyData);
                    } else {
                        setHierarchy([{ name: "No Data", expanded: false, children: [], job_title: "" }]);
                    }
                } else {
                    console.error("Invalid data format: Expected an array");
                    setHierarchy([{ name: "No Data", expanded: false, children: [], job_title: "" }]);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch management summary:", error);
                setHierarchy([{ name: "Error Fetching Data", expanded: false, children: [], job_title: "" }]);
            });
    }, [company, API_URL]);

    const buildHierarchy = (employees: EmployeeHierarchicalInfo[]): HierarchyNode[] => {
        const map = new Map<number, HierarchyNode>();

        // Préparer les nœuds de base
        employees.forEach((employee) => {
            map.set(employee.id, {
                name: employee.name,
                job_title: employee.job_title,
                expanded: true, // Ajouter 'expanded' par défaut
                children: [],
            });
        });

        const roots: HierarchyNode[] = [];

        // Construire la hiérarchie
        employees.forEach((employee) => {
            if (employee.manager_id === null) {
                // Si l'employé n'a pas de manager, il est une racine
                roots.push(map.get(employee.id)!);
            } else {
                // Ajouter l'employé comme enfant de son manager
                const manager = map.get(employee.manager_id);
                if (manager) {
                    manager.children.push(map.get(employee.id)!);
                }
            }
        });

        return roots;
    };

    const nodeTemplate = (node: HierarchyNode) => {
        return (
            <div style={{"fontSize": "12px", width: "80px" }}>
                <div style={{ fontWeight: "bold" }}>{node.name}</div>
                <div>{node.job_title}</div>
                <br />
            </div>
        );
    };

    return (
        <div>
            <div style={{fontSize:"16px",fontWeight:"bold"}}>Organigramme</div>
            <OrganizationChart
                value={hierarchy.length > 0 ? hierarchy : [{ label: "No Data", expanded: true, children: [] }]}
                nodeTemplate={nodeTemplate}
            />
        </div>
    );
};

export default HierarchyChart;
