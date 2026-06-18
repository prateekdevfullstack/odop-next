import type { Metadata } from "next";
import { Suspense } from "react";
import SuppliersSkeleton from "@/bones/SuppliersSkeleton";
import SuppliersClient from "./SuppliersClient";

export const metadata: Metadata = {
 title: "Supplier Directory | ODOP",
 description:
 "Browse ODOP supplier directory — manufacturers, wholesalers, distributors, shopkeepers, artisans, and exporters across districts.",
};

export default async function SuppliersPage() {
 return (<main className="main-content schemes-page">
 <section className="page-hero schemes-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 </div>
 </section>
 <Suspense fallback={<SuppliersSkeleton />}>
   <SuppliersClient />
 </Suspense>
 </main>);
}