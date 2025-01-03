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
};

type HierarchyNode = {
    label: string;
    expanded: boolean; // Ajout d'expanded
    children: HierarchyNode[];
};

interface HierarchyChartProps {
    company: Company;
}

const HierarchyChart: React.FC<HierarchyChartProps> = ({ company }) => {
    const [employees, setEmployees] = useState<EmployeeHierarchicalInfo[] | null>(null);
    const [hierarchy, setHierarchy] = useState<HierarchyNode[]>([]);
    const API_URL = process.env.REACT_APP_BACKEND_URL;

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
                        setHierarchy([{ label: "No Data", expanded: false, children: [] }]);
                    }
                } else {
                    console.error("Invalid data format: Expected an array");
                    setHierarchy([{ label: "No Data", expanded: false, children: [] }]);
                }
            })
            .catch((error) => {
                console.error("Failed to fetch management summary:", error);
                setHierarchy([{ label: "Error Fetching Data", expanded: false, children: [] }]);
            });
    }, [company, API_URL]);

    const buildHierarchy = (employees: EmployeeHierarchicalInfo[]): HierarchyNode[] => {
        const map = new Map<number, HierarchyNode>();

        // Préparer les nœuds de base
        employees.forEach((employee) => {
            map.set(employee.id, {
                label: employee.name,
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

    return (
        <div>
            <h3>Organigramme</h3>
            <OrganizationChart
                value={hierarchy.length > 0 ? hierarchy : [{ label: "No Data", expanded: true, children: [] }]}
            />
        </div>
    );
};

export default HierarchyChart;
