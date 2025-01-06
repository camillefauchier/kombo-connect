import { useEffect, useState } from "react";
import Sidebar from "../components/SideBar";
import Dashboard from "../components/Dashboard";
import "./Companies.css"
import axios from "axios";

export interface Company {
    id: number;
    companyName: string;
    integrationId: string;
}

function Companies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    useEffect(() => {
        console.log(console.log("API URL:", process.env.REACT_APP_KOMBO_BACKEND_URL));
        axios.get(`${process.env.REACT_APP_KOMBO_BACKEND_URL}/companies`).then((response) => {
            setCompanies(response.data);
        }).catch((error) => {
            console.error("Failed to fetch companies:", error);
        });
    }, []);

    return (
        <div className="companies-page">
            <Sidebar
                companies={companies}
                selectedCompany={selectedCompany}
                onSelectCompany={setSelectedCompany}
            />
            <Dashboard company={selectedCompany} />
        </div>
    );
}

export default Companies;
