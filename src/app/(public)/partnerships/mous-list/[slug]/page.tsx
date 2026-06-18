import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getMouBySlug, mouRecords } from "@/lib/mou-data";
import "@/styles/mous-list.css";

type MouDetailPageProps = {
 params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MouDetailPageProps): Promise<Metadata> {
 const { slug } = await params;
 const mou = getMouBySlug(slug);

 if (!mou) {
 return {
 title: "MOU Detail | Partnerships | ODOP",
 description: "MOU attachment details under ODOP partnerships.",
 };
 }

 return {
 title: `${mou.title} | MOU Detail | ODOP`,
 description: `Signed date and attachment for ${mou.title} under ODOP partnerships.`,
 };
}

export async function generateStaticParams() {
 return mouRecords.map((mou) => ({ slug: mou.slug }));
}

export default async function MouDetailPage({ params }: MouDetailPageProps) {
 const { slug } = await params;
 const mou = getMouBySlug(slug);

 if (!mou) {
 notFound();
 }

 return (<div className="mous-list-page">
 <section className="page-hero mous-hero relative">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content relative z-10">
 <h1 className="page-hero-title">MOU Attachment</h1>
 <p className="page-hero-subtitle !max-w-2xl !mx-auto">{mou.title}</p>
 </div>
 </section>

 <main className="mous-page section">
 <div className="container">
 <div className="section-header !mb-12">
 <span className="eyebrow">Official Document</span>
 <h2 className="!mt-4 !text-3xl !md:text-4xl !font-bold !text-gray-900">{mou.title}</h2>
 <div className="divider !mt-6"><span /><span /><span /></div>
 </div>

 <div className="max-w-4xl mx-auto">
 <article className="mous-detail-card">
 <h3 className="!text-2xl !font-bold !text-gray-900 !mb-8 !flex !items-center !gap-3">
 <i className="fas fa-file-contract !text-[#E8562E]" />
 MOU Details
 </h3>
 <div className="!space-y-8">
 <div>
 <span className="mous-detail-label">Document Title</span>
 <p className="mous-detail-value">{mou.title}</p>
 </div>
 <div>
 <span className="mous-detail-label">Signed On</span>
 <p className="mous-detail-value">
 <span className="mous-badge !px-4 !py-2 !text-sm">
 {mou.signedOn}
 </span>
 </p>
 </div>
 <div className="!pt-8 !border-t !border-gray-100 !flex !flex-wrap !gap-4">
 <a
 href={mou.attachmentPath}
 target="_blank"
 rel="noopener noreferrer"
 className="btn !btn-primary !rounded-full !px-8 !py-4 !font-bold !shadow-lg hover:!shadow-xl !transition-all"
 >
 <i className="fas fa-external-link-alt !mr-2"></i>
 Open Full Document
 </a>
 
 <Link 
 href="/partnerships/mous-list" 
 className="btn !btn-outline-primary !rounded-full !px-8 !py-4 !font-bold !group !transition-all"
 >
 <i className="fas fa-arrow-left !mr-2 group-hover:!-translate-x-1 !transition-transform" />
 Back to List
 </Link>
 </div>
 </div>
 </article>
 </div>
 </div>
 </main>
 </div>);
}
