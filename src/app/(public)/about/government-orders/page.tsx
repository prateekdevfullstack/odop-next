import type { Metadata } from "next";
import Image from "next/image";
import Breadcrumb from "@/components/shared/Breadcrumb";
import T from "@/components/shared/T";
import "@/styles/cfc-list.css";

export const metadata: Metadata = {
    title: "Government Orders | About ODOP",
    description: "Government orders (GOs) issued for the ODOP programme.",
};

const governmentOrders = [
    {
        subject: "Approval for launching the scheme for promotion of common facilities under the 'One District One Product' scheme - 2018",
        subjectHi: "'एक जनपद एक उत्पाद' योजना के अंतर्गत सामान्य सुविधाओं के प्रोत्साहन हेतु योजना के शुभारंभ की स्वीकृति - 2018",
        language: "Hindi",
        languageHi: "हिन्दी",
        dateOfIssue: "06-11-2018",
        uploadedOn: "04-03-2025",
        href: "/assets/document/GO/GO_CFC_2018.pdf",
    },
    {
        subject: "Regarding partial amendment in Government Order No. 1095/18-4-2018-18 (Miscellaneous)/17 TC-111, dated 06-11-2018, regarding starting of Common Facility Centre Promotion Scheme under 'One District One Product' Scheme - 2023",
        subjectHi: "शासनादेश संख्या 1095/18-4-2018-18 (विविध)/17 टी.सी.-111, दिनांक 06-11-2018 में आंशिक संशोधन के संबंध में, 'एक जनपद एक उत्पाद' योजना के अंतर्गत सामान्य सुविधा केंद्र प्रोत्साहन योजना के शुभारंभ के संबंध में - 2023",
        language: "Hindi",
        languageHi: "हिन्दी",
        dateOfIssue: "03-10-2023",
        uploadedOn: "04-03-2025",
        href: "/assets/document/GO/GO_CFC_2023.pdf",
    },
    {
        subject: "Approval to operate a financial assistance scheme under the 'One District One Product' program - 2019",
        subjectHi: "'एक जनपद एक उत्पाद' कार्यक्रम के अंतर्गत वित्तीय सहायता योजना के संचालन की स्वीकृति - 2019",
        language: "Hindi",
        languageHi: "हिन्दी",
        dateOfIssue: "24-09-2018",
        uploadedOn: "04-03-2025",
        href: "/assets/document/GO/GO_Margin_Money_2018.pdf",
    },
    {
        subject: "Regarding the launch of 'One District One Product Marketing Promotion Scheme - 2019",
        subjectHi: "'एक जनपद एक उत्पाद विपणन प्रोत्साहन योजना - 2019' के शुभारंभ के संबंध में",
        language: "Hindi",
        languageHi: "हिन्दी",
        dateOfIssue: "22-01-2019",
        uploadedOn: "04-03-2025",
        href: "/assets/document/GO/GO_MDA_2019.pdf",
    },
    {
        subject: "Regarding amendment in the 'One District One Product Marketing Promotion Scheme - 2020",
        subjectHi: "'एक जनपद एक उत्पाद विपणन प्रोत्साहन योजना - 2020' में संशोधन के संबंध में",
        language: "Hindi",
        languageHi: "हिन्दी",
        dateOfIssue: "22-04-2020",
        uploadedOn: "04-03-2025",
        href: "/assets/document/GO/GO_MDA_2020.pdf",
    },
    {
        subject: "Regarding starting of efficiency/skill development/entrepreneurship development training and toolkit distribution scheme under One District One Product Programme - 2020",
        subjectHi: "एक जनपद एक उत्पाद कार्यक्रम के अंतर्गत दक्षता/कौशल विकास/उद्यमिता विकास प्रशिक्षण एवं टूलकिट वितरण योजना के शुभारंभ के संबंध में - 2020",
        language: "Hindi",
        languageHi: "हिन्दी",
        dateOfIssue: "05-05-2020",
        uploadedOn: "04-03-2025",
        href: "/assets/document/GO/GO_Training_%26_Toolkit_2020.pdf",
    },
];

export default function GovernmentOrdersPage() {
    return (
<div className="cfc-list-page">
         <section style={{ position: "relative", width: "100%", height: "250px", lineHeight: 0, overflow: "hidden" }}>
          <Image src="/assets/img/banner/Mask_group_img.png" alt="" aria-hidden={true} style={{ display: "block", width: "100%", height: "100%", objectFit: "cover" }} width={1920} height={480} />
          <Image src="/assets/img/banner/metal-craft.png" alt="" aria-hidden={true} style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "auto", maxWidth: "48%", height: "100%", objectFit: "contain", objectPosition: "bottom right", zIndex: 2 }} width={800} height={600} />
          <div style={{ position: "absolute", left: "clamp(16px, 5vw, 80px)", bottom: 40, zIndex: 3, lineHeight: "normal" }}>
            <h1 className="media-heading"><T en="About" hi="परिचय" /></h1>
            <Breadcrumb en="Government Orders" hi="शासनादेश" />
          </div>
        </section>
        
        <main className="cfc-page section">
            <div className="container">
                <div className="cfc-capsule-heading-wrap">
                     <h1 className="resource-heading-common"><T en="ODOP Government Orders" hi="ओडीओपी शासनादेश" /></h1>
                </div>

                <section className="cfc-section">
                        <div className="table-wrap cfc-table-scroll">
                            <table className="cfc-table cfc-table-compact government-orders-table">
                                <thead>
                                    <tr>
                                        <th><T en="Sr. No." hi="क्र. सं." /></th>
                                        <th><T en="Date of Issue" hi="जारी करने की तिथि" /></th>
                                        <th><T en="Subject" hi="विषय" /></th>
                                        <th><T en="Language" hi="भाषा" /></th>
                                        <th><T en="View / Download" hi="देखें / डाउनलोड करें" /></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {governmentOrders.map((order, index) => (
                                        <tr key={order.href}>
                                            <td>{index + 1}</td>
                                            <td>{order.dateOfIssue}</td>
                                            <td><T en={order.subject} hi={order.subjectHi} /></td>
                                            <td><T en={order.language} hi={order.languageHi} /></td>
                                            <td>
                                                <a
                                                    className="cfc-link-btn"
                                                    href={order.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <T en="View / Download" hi="देखें / डाउनलोड करें" />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                </section>
            </div>
        </main>
        </div>
    );
}
