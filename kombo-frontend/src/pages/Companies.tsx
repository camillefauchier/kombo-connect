import {useEffect, useState} from "react";
import Sidebar from "../components/SideBar";
import Dashboard from "../components/Dashboard";
import axios from "axios";

export interface Company {
    id: string;
    name: string;
}
const API_URL = process.env.REACT_APP_BACKEND_URL;

function Companies() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    useEffect(() => {
        axios.get(`${API_URL}/companies`).then((response) => {
            setCompanies(response.data);
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