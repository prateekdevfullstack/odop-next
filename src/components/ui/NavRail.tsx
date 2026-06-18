"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    FaBars, 
    FaChevronRight, 
    FaSheetPlastic, 
    FaLightbulb, 
    FaMapLocationDot, 
    FaLayerGroup,
    FaChartPie
} from "react-icons/fa6";

const navLinks = [
    { name: "Schemes", href: "/odop-schemes", icon: <FaSheetPlastic /> },
    { name: "DPR", href: "/knowledge-base/project-report", icon: <FaLightbulb /> },
    { name: "All Districts", href: "/districts", icon: <FaMapLocationDot /> },
    { name: "CFCs", href: "/resources/cfc-list", icon: <FaLayerGroup /> },
    { name: "Financial Report", href: "/partnerships/scheme-budget-report", icon: <FaChartPie /> },
];

export default function NavRail() {
    const pathname = usePathname();

    return (
        <div className="nav-rail-wrapper">
            <nav className="nav-rail" aria-label="Quick Navigation Rail">
                <div className="nav-rail-trigger">
                    <FaBars className="icon-menu" />
                    <FaChevronRight className="icon-chevron" />
                </div>
                <ul className="nav-rail-list">
                    {navLinks.map((link) => (
                        <li key={link.href} className="nav-rail-item">
                            <Link
                                href={link.href}
                                className={`nav-rail-link ${pathname === link.href ? "is-active" : ""}`}
                                data-name={link.name}
                            >
                                <span className="nav-rail-icon">{link.icon}</span>
                                <span className="nav-rail-text">{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
}
