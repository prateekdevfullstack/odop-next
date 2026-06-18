"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaChartLine, FaBoxOpen, FaEnvelopeOpenText, FaIdCard } from "react-icons/fa";

const navLinks = [
  { name: "Dashboard", href: "/supplier/dashboard", icon: <FaChartLine /> },
  { name: "Products", href: "/supplier/products", icon: <FaBoxOpen /> },
  { name: "Enquiries", href: "/supplier/enquiries", icon: <FaEnvelopeOpenText /> },
  { name: "My Profile", href: "/supplier/profile", icon: <FaIdCard /> },
];

export default function SupplierSubNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white !mb-4">
      <div className="container">
        <div className="flex flex-wrap gap-4  !py-4 ">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all border-b-2 ${
                isActive
                  ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className={isActive ? "text-[var(--primary)]" : "text-gray-400"}>
                {link.icon}
              </span>
              {link.name}
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
