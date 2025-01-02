import React from "react";
import "../App.css"
import {Company} from "../pages/Companies";


interface SidebarProps {
    companies: Company[];
    selectedCompany: Company | null;
    onSelectCompany: (company: Company) => void;
}

function Sidebar({ companies, selectedCompany, onSelectCompany }: SidebarProps) {
    return (
        <aside className="sidebar">
            <h3>Liste des entreprises</h3>
            <ul>
                {companies.map((company) => (
                    <li
                        key={company.id}
                        className={ selectedCompany ? selectedCompany.id === company.id ? "selected" : "" :""}
                        onClick={() => onSelectCompany(company)}
                    >
                        {company.companyName}
                    </li>
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
