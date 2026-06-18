import type { Metadata } from "next";
import "@/styles/nabl-labs.css";
import Image from "next/image";

export const metadata: Metadata = {
 title: "GI Products | Resources | ODOP",
 description:
 "NABL-accredited laboratories for testing, calibration and certification of ODOP products.",
};

type GIProduct = {
 sNo: number;
 name_of_GI_product: string;
 category: string;
};

const giproduct: GIProduct[] = [
 { sNo: 1, name_of_GI_product: "Agra Handmade Carpet", category: "Handicraft" },
 { sNo: 2, name_of_GI_product: "Agra Stone Carving Craft", category: "Handicraft" },
 { sNo: 3, name_of_GI_product: "Agra Zardoji", category: "Handicraft" },
 { sNo: 4, name_of_GI_product: "Agra Dalmot", category: "Cuisine" },
 { sNo: 5, name_of_GI_product: "Aligarh Metal Lamp", category: "Handicraft" },
 { sNo: 6, name_of_GI_product: "Aligarh Metal Buckle craft", category: "Handicraft" },
 { sNo: 7, name_of_GI_product: "Meerut Cricket Bat", category: "Handicraft" },
 { sNo: 8, name_of_GI_product: "Meerut Leather Cricket Bal", category: "Handicraft" },
 { sNo: 9, name_of_GI_product: "Meerut Football", category: "Handicraft" },
 { sNo: 10, name_of_GI_product: "Meerut Discus Throw (Sport Goods)", category: "Handicraft" },
 { sNo: 11, name_of_GI_product: "Meerut Band Drum (Musical Inst.)", category: "Handicraft" },
 { sNo: 12, name_of_GI_product: "Meerut Mashak Bean (Musical Instrument)", category: "Handicraft" },
 { sNo: 13, name_of_GI_product: "Meerut Revadi", category: "Cuisine" },
 { sNo: 14, name_of_GI_product: "Khurja Khurchan", category: "Cuisine" },
 { sNo: 15, name_of_GI_product: "Gorakhpur Home Furnishing", category: "Handloom" },
 { sNo: 16, name_of_GI_product: "Gorakhnath Khaja (Khajala) of Gorakhpur", category: "Cuisine" },
 { sNo: 17, name_of_GI_product: "Gorakhpur Dhaka Topi Fabric", category: "Handicraft" },
 { sNo: 18, name_of_GI_product: "Gorakhpur Sakhu (Wood)", category: "Natural Goods" },
 { sNo: 19, name_of_GI_product: "Maghar Handloom", category: "Handloom" },
 { sNo: 20, name_of_GI_product: "Bijnor Home Furnishing", category: "Handloom" },
 { sNo: 21, name_of_GI_product: "Hamirpur Juti", category: "Handicraft" },
 { sNo: 22, name_of_GI_product: "Hamirpur Gud (Jaggery)", category: "Cuisine" },
 { sNo: 23, name_of_GI_product: "Lakhimpur Kheri Gud (Jaggery)", category: "Cuisine" },
 { sNo: 24, name_of_GI_product: "Maigal Ganj Rasgulla of Lakhimpur Kheri", category: "Cuisine" },
 { sNo: 25, name_of_GI_product: "Banaras Malaiyo (sweet)", category: "Cuisine" },
 { sNo: 26, name_of_GI_product: "Banarasi Parwal ki Mithai", category: "Cuisine" },
 { sNo: 27, name_of_GI_product: "Banaras Malai Puri", category: "Cuisine" },
 { sNo: 28, name_of_GI_product: "Banarasi Magdal", category: "Cuisine" },
 { sNo: 29, name_of_GI_product: "Banaras Kimami Sewai", category: "Cuisine" },
 { sNo: 30, name_of_GI_product: "Banaras Mithi Supari", category: "Cuisine" },
 { sNo: 31, name_of_GI_product: "Banaras Kala Pankha (Fan)", category: "Handicraft" },
 { sNo: 32, name_of_GI_product: "Banaras Wood Craft (Puja Utensils)", category: "Handicraft" },
 { sNo: 33, name_of_GI_product: "Banaras Kundan Jadai Jewellery", category: "Handicraft" },
 { sNo: 34, name_of_GI_product: "Banaras Khudai Ka Kam", category: "Handicraft" },
 { sNo: 35, name_of_GI_product: "Banaras Jodi Gada (traditional Sports goods)", category: "Handicraft" },
 { sNo: 36, name_of_GI_product: "Kannauj Gatta (sweet)", category: "Cuisine" },
 { sNo: 37, name_of_GI_product: "Kannauj Mitti Atar (Itra)", category: "Handicraft" },
 { sNo: 38, name_of_GI_product: "Bahraich Gehu Danthal Craft", category: "Handicraft" },
 { sNo: 39, name_of_GI_product: "Lucknow Bone Carving craft", category: "Handicraft" },
 { sNo: 40, name_of_GI_product: "Lucknow Calligraphy craft", category: "Handicraft" },
 { sNo: 41, name_of_GI_product: "Lucknow Batik Print", category: "Handicraft" },
 { sNo: 42, name_of_GI_product: "Lucknow Chinhat Pottery", category: "Handicraft" },
 { sNo: 43, name_of_GI_product: "Lucknow Mukeshi Craft", category: "Handicraft" },
 { sNo: 44, name_of_GI_product: "Lucknow Sheermal (food)", category: "Cuisine" },
 { sNo: 45, name_of_GI_product: "Lucknow Metal Nakkasi", category: "Handicraft" },
 { sNo: 46, name_of_GI_product: "Banda Sohan Halwa", category: "Cuisine" },
 { sNo: 47, name_of_GI_product: "Mahoba Metal Craft", category: "Handicraft" },
 { sNo: 48, name_of_GI_product: "Mathura Silver Craft", category: "Handicraft" },
 { sNo: 49, name_of_GI_product: "Rampur Violine", category: "Handicraft" },
 { sNo: 50, name_of_GI_product: "Rampur Kite", category: "Handicraft" },
 { sNo: 51, name_of_GI_product: "Barkachha Gulabjamun of Mirzapur", category: "Cuisine" },
 { sNo: 52, name_of_GI_product: "Rampur Adarak Halwa", category: "Cuisine" },
 { sNo: 53, name_of_GI_product: "Bareilly Jhumka", category: "Handicraft" },
 { sNo: 54, name_of_GI_product: "Bareilly Surma", category: "Handicraft" },
 { sNo: 55, name_of_GI_product: "Sonebhadra Tikhur", category: "Cuisine" },
 { sNo: 56, name_of_GI_product: "Iglas ki Chamcham of Aligarh", category: "Cuisine" },
 { sNo: 57, name_of_GI_product: "Saharanpur Honey", category: "Cuisine" },
 { sNo: 58, name_of_GI_product: "Sambhal Pearl Craft", category: "Handicraft" },
 { sNo: 59, name_of_GI_product: "Sandila Laddoo", category: "Cuisine" },
 { sNo: 60, name_of_GI_product: "Sonebhadra Chiroji", category: "Cuisine" },
 { sNo: 61, name_of_GI_product: "Shahjahanpur Tilhar ki Launj", category: "Cuisine" },
 { sNo: 62, name_of_GI_product: "Shahjahanpur Handmade Carpet", category: "Handicraft" },
 { sNo: 63, name_of_GI_product: "Pilibhit Furniture", category: "Handicraft" },
 { sNo: 64, name_of_GI_product: "Pilibhit Tiger Reserve Honey", category: "Cuisine" },
 { sNo: 65, name_of_GI_product: "Eta Chikori", category: "Cuisine" },
 { sNo: 66, name_of_GI_product: "Hapur Papad", category: "Cuisine" },
 { sNo: 67, name_of_GI_product: "Ballia Sattu", category: "Cuisine" },
 { sNo: 68, name_of_GI_product: "Basti Sirka", category: "Cuisine" },
 { sNo: 69, name_of_GI_product: "Deoria Crosia Craft", category: "Handicraft" },
 { sNo: 70, name_of_GI_product: "Hardoi Handloom products", category: "Handloom" },
 { sNo: 71, name_of_GI_product: "Hathras Metal Chitai Craft", category: "Handicraft" },
 { sNo: 72, name_of_GI_product: "Hathras Metal Casting Craft", category: "Handicraft" },
 { sNo: 73, name_of_GI_product: "Azamgarh Safed Gajar ka Halwa", category: "Cuisine" },
 { sNo: 74, name_of_GI_product: "Bagpat Balushahi", category: "Cuisine" },
 { sNo: 75, name_of_GI_product: "Auraiya Desi Ghee", category: "Cuisine" },
];



export default async function GIProducts(){
 return (<div className="nabl-labs-page">
 <section className="page-hero nabl-hero relative">
 <div className="page-hero-overlay"></div>
 <div className="container page-hero-content relative z-10">
 <h1 className="page-hero-title">List of GI Product</h1>
 <p className="page-hero-subtitle">Project supported by - Directorate of Industries & Enterprises Promotion (ODOP Cell), Govt of U.P
 </p>
 </div>
 </section>

 <section className="about-section">
 <div className="container">
 <div className="about-overview-grid">
 <div className="about-overview-visual">
 <div className="about-image-stack">
 <Image
 src="/assets/img/gi-img.jpg"
 alt="NABL Accredited Laboratory"
 className="about-main-image"
 width={600}
 height={400}
 />
 </div>
 </div>
 <div className="about-overview-content">
 <div className="section-eyebrow">Status Report - 75 GI Applications </div>
 <h2 className="section-title">GI Products Strengthening the state’s Traditional Industries</h2>
 <p>
 With 79 GI products, the programme region leads the country, while Tamil Nadu, with 74 GI products, ranks second in the country.
 </p>
 <p>
 GI products are related to various product categories – agriculture-based, MSME, handicrafts, handloom and textile industry, food processing, horticulture, etc but largely ODOP (49) & ODOC.
 </p>
 <p>GI committees constituted under the chairmanship of the District Magistrate in each district will be further empowered.</p>

 <p>The project of GI registration process of 75 selected products related to MSME and cuisine has identified according to the merit of product from various districts and few of them is also under ODOP.</p>
 
 <p>The organisation has identified many cuisines which have strong merit and potential for GI from various parts, including traditional honey. The region is among the highest producers of honey in the country, with excellent biodiversity. To map geographical coverage, the organisation has identified nearly all important geographical regions like the Vindhya region, Tarai region, and forest areas including tiger reserve zones that are well known for exotic honey production by local communities.</p>
 </div>
 </div>
 </div>
 </section>

 <main className="nabl-main-content section">
 <div className="container">
 <section className="nabl-section">
 <h2>Product Identified for GI Registration Process @ 75 GI Applications </h2>
 <div className="nabl-table-scroll">
 <table className="nabl-table">
 <thead>
 <tr>
 <th>S. No.</th>
 <th>Name of GI Product</th>
 <th>Category</th>
 </tr>
 </thead>

 <tbody>
 {giproduct.length === 0 ? (<tr>
 <td colSpan={3} className="no-data-cell">
 <div className="no-data-found">
 <i className="fas fa-microscope"></i>
 <p>No GI Product found.</p>
 </div>
 </td>
 </tr>) : (giproduct.map((item) => (<tr key={item.sNo}>
 <td
 style={{
 textAlign: "center",
 fontWeight: "600",
 color: "#153b66",
 }}
 >
 {item.sNo}
 </td>

 <td style={{ color: "#4a6078" }}>
 {item.name_of_GI_product}
 </td>

 <td style={{ color: "#4a6078" }}>
 {item.category}
 </td>
 </tr>)))}
 </tbody>
 </table>
 </div>
 </section>
 </div>
 </main>
 </div>);
}
