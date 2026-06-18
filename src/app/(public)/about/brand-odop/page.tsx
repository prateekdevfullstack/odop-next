import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
 title: "Brand ODOP | About ODOP",
 description: "Brand ODOP concept, scope, and implementation approach of One District One Product.",
};

export default function BrandOdopPage() {
 return (<main className="main-content schemes-page about-static-page">
 <section className="page-hero-section">
 <div className="page-hero-wrapper">
 <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
 <div className="page-hero-overlay" />
 <div className="page-hero-content">
 <h1 className="page-hero-title">About</h1>
 <div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Brand ODOP</span></div>
 </div>
 </div>
 </section>
 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Brand Strategy</span>
 <h2>Brand ODOP Framework</h2>
 <p>Concept, objectives, and implementation priorities that shape district-led product identity.</p>
 <div className="divider"><span /><span /><span /></div>
 </div>
 <section className="static-content-wrap">
 <article className="static-card">
 <h3>Concept: One District - One Product</h3>
 <p>Spread over an area of 2,40,928 square kilometers, the region ranks among the largest in India in terms of area, comprising 7.3% of the total area of the country. It is also among the most populous, with the 2011 census count representing about 16.5% of the total population of the country.</p>
 <p>In terms of size of the economy, the state ranks third in the country, with a share of 8.4% and GDP of 11,45,234 Cr in the year 2015-16. The MSME sector plays an important role in the economy of the state and is a significant contributor to capital investment, production and employment.</p>
 <p>In terms of number of MSME units (about 46 lakh units, 8%), the region ranks first in the country. This sector, locally as well as nationally, is the largest contributor to employment after agriculture. It has been a leading contributor to exports of handicrafts, processed food, engineering goods, carpet, readymade garments and leather products.</p>
 <p>The export of handicrafts from districts contributes 44% to total export of handicrafts from the country. Similarly, this contribution stands at 39% in carpets and 26% in leather and leather products. The share in total exports from the country is 4.73%.</p>
 <p>Almost each district in the state has one or more unique products, whether in handicrafts, handlooms, agriculture or horticulture produce, or small enterprises, with distinct identity at national and international levels.</p>
 </article>
 <article className="static-card">
 <h3>Key Objectives Under Brand ODOP</h3>
 <ul className="static-list">
 <li><i className="fas fa-circle-check" aria-hidden="true" /><span>Preserve and develop local crafts and skills.</span></li>
 <li><i className="fas fa-circle-check" aria-hidden="true" /><span>Increase incomes and local employment resulting in decline in migration for employment.</span></li>
 <li><i className="fas fa-circle-check" aria-hidden="true" /><span>Improve product quality and skill development.</span></li>
 <li><i className="fas fa-circle-check" aria-hidden="true" /><span>Transform products in an artistic way through packaging and branding.</span></li>
 <li><i className="fas fa-circle-check" aria-hidden="true" /><span>Connect production with tourism through live demo and sales outlets for gifts and souvenirs.</span></li>
 <li><i className="fas fa-circle-check" aria-hidden="true" /><span>Resolve issues of economic difference and regional imbalance.</span></li>
 <li><i className="fas fa-circle-check" aria-hidden="true" /><span>Take ODOP to national and international level after successful implementation at state level.</span></li>
 </ul>
 </article>
 <article className="static-card">
 <h3>Implementation Focus</h3>
 <ul className="static-list">
 <li><i className="fas fa-diagram-project" aria-hidden="true" /><span>District-wise product and stakeholder database development.</span></li>
 <li><i className="fas fa-lightbulb" aria-hidden="true" /><span>Research on possibilities regarding production, development and marketing of products.</span></li>
 <li><i className="fas fa-file-signature" aria-hidden="true" /><span>Micro-plan for product development, marketing promotion, additional employment and wage increment.</span></li>
 <li><i className="fas fa-bullhorn" aria-hidden="true" /><span>Advertising, publicity, and market access at district, state, national, and global levels.</span></li>
 <li><i className="fas fa-hand-holding-dollar" aria-hidden="true" /><span>Coordination with MUDRA, PMEGP, Stand Up schemes, Mukhya Mantri Yuva Swarojgar Yojna and Vishwakarma Shram Samman Yojna for finance to new and existing units.</span></li>
 <li><i className="fas fa-people-group" aria-hidden="true" /><span>Setup of cooperatives and self-help groups.</span></li>
 <li><i className="fas fa-graduation-cap" aria-hidden="true" /><span>General and technical training of craft and technology development.</span></li>
 </ul>
 </article>
 </section>
 </div>
 </main>);
}
