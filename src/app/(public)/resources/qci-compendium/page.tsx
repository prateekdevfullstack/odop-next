import type { Metadata } from "next";
import "@/styles/nabl-labs.css";
import "@/styles/cfc-list.css";
import { getLanguageServer } from "@/lib/language";
import PageBanner from "@/components/shared/PageBanner";

export async function generateMetadata(): Promise<Metadata> {
    const lang = await getLanguageServer();
    if (lang === "hi") {
        return {
            title: "क्यूसीआई संकलन | संसाधन | ओडीओपी",
            description: "ओडीओपी उत्पाद श्रेणियों का क्यूसीआई संकलन — श्रेणीवार संकलन पीडीएफ देखें या डाउनलोड करें।",
        };
    }
    return {
        title: "QCI Compendium | Resources | ODOP",
        description: "QCI Compendium of ODOP product categories — download or view category-wise compendium PDFs.",
    };
}

const compendiums = [
    { sNo: 1,  category: "Carpets & Durries",          file: "Compendium_Carpets & Durries.pdf" },
    { sNo: 2,  category: "Ceramic Products",            file: "Compendium_Ceramic Products.pdf" },
    { sNo: 3,  category: "Engineering Goods",           file: "Compendium_ Engineering Goods.pdf" },
    { sNo: 4,  category: "Food Products",               file: "Compendium_Food Products.pdf" },
    { sNo: 5,  category: "Glassware",                   file: "Compendium _Glassware.pdf" },
    { sNo: 6,  category: "Handicraft",                  file: "Compendium_Handicraft.pdf" },
    { sNo: 7,  category: "Leather & Leather Products",  file: "Compendium_Leather & Leather Products.pdf" },
    { sNo: 8,  category: "Metal Craft",                 file: "Compendium_Metal Craft.pdf" },
    { sNo: 9,  category: "Miscellaneous Products",      file: "Compendium_Miscellaneous Products.pdf" },
    { sNo: 10, category: "Musical Instruments",         file: "Compendium_Musical Instruments.pdf" },
    { sNo: 11, category: "Plastic Products",            file: "Compendium_Plastic Products.pdf" },
    { sNo: 12, category: "Sport Goods",                 file: "Compendium_Sport Goods.pdf" },
    { sNo: 13, category: "Textile Goods",               file: "Compendium_Textile Goods.pdf" },
    { sNo: 14, category: "Utensils",                    file: "Compendium_Utensils.pdf" },
    { sNo: 15, category: "Wood Products",               file: "Compendium_Wood Products.pdf" },
];

const BASE_PATH = "/assets/document/pdf-attachment/";

export default async function QciCompendiumPage() {
    const lang = await getLanguageServer();
    const isHi = lang === "hi";

    return (
        <div className="qci-compendium-page">
            <PageBanner
                imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
                eyebrow={isHi ? "ज्ञान केंद्र" : "Knowledge Hub"}
                current={isHi ? "गुणवत्ता परिषद संकलन" : "QCI Compendium"}
            />

            <main className="qci-main-content section">
                <div className="container">
                    <div className="resource-capsule-heading-wrap">
                        <h1 className="resource-heading-common">
                            {isHi ? "क्यूसीआई संकलन" : "QCI Compendium"}
                        </h1>
                    </div>

                    <section className="nabl-section">
                        <div className="nabl-table-scroll">
                            <table className="nabl-table">
                                <thead>
                                    <tr>
                                        <th>{isHi ? "क्र.सं." : "S. No."}</th>
                                        <th>{isHi ? "उत्पाद श्रेणी" : "Product Category"}</th>
                                        <th>{isHi ? "देखें / डाउनलोड" : "View / Download"}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {compendiums.map((item) => (
                                        <tr key={item.sNo}>
                                            <td style={{ fontWeight: "600", color: "#153b66" }}>{item.sNo}</td>
                                            <td>
                                                <span className="category-chip">{item.category}</span>
                                            </td>
                                            <td>
                                                <a
                                                    className="cfc-pdf-btn"
                                                    href={BASE_PATH + encodeURIComponent(item.file)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className="fas fa-file-pdf"></i>{" "}
                                                    {isHi ? "पीडीएफ देखें" : "View PDF"}
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
