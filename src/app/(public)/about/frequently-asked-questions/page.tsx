import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
export const metadata: Metadata = { title: "Frequently Asked Questions (FAQs) | About ODOP", description: "Frequently asked questions about the ODOP programme." };
export default function FrequentlyAskedQuestionsPage() {
 return (<main className="main-content schemes-page about-static-page policy-page">
 <section className="page-hero-section">
 <div className="page-hero-wrapper">
 <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
 <div className="page-hero-overlay" />
 <div className="page-hero-content">
 <h1 className="page-hero-title">About</h1>
 <div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Frequently Asked Questions</span></div>
 </div>
 </div>
 </section>

 <div className="container">
 <div className="section-header">
 <span className="eyebrow">ODOP Support</span>
 <h2>Common Questions and Answers</h2>
 <div className="divider"><span></span><span></span><span></span></div>
 </div>
 <section className="static-content-wrap faq-wrap">
 <article className="static-card">
 <h3>What is ODOP Programme?</h3>
 <p>The One District One Product (ODOP) Programme was envisioned and inaugurated on January 24, 2018
 by the Hon'ble Chief Minister Shri Yogi Adityanath on Foundation Day. The project
 aims to encourage visibility and sale of indigenous and specialized products/crafts across districts and generate employment at district level.</p>
 <p>Under the project, one particular product is selected from every district. These
 products are traditionally famous in their districts, and many are GI-tagged. The programme
 supports artisans, production units and associations through loan support, Common Facility
 Centers, and marketing assistance.</p>
 </article>
 <article className="static-card">
 <h3>Objectives of ODOP Programme</h3>
 <ul className="static-list">
 <li><i className="fas fa-circle-check"></i><span>Secure preservation and development of local
 crafts/skills and promotion of art.</span></li>
 <li><i className="fas fa-circle-check"></i><span>Provide employment to youth and promote a
 competitive ecosystem in the state.</span></li>
 <li><i className="fas fa-circle-check"></i><span>Capacity building and promotion of local
 skills.</span></li>
 <li><i className="fas fa-circle-check"></i><span>Prevent migration by improving income and local
 employment.</span></li>
 <li><i className="fas fa-circle-check"></i><span>Improve product quality and skill
 development.</span></li>
 <li><i className="fas fa-circle-check"></i><span>Increase overall exports of selected
 products.</span></li>
 <li><i className="fas fa-circle-check"></i><span>Promote ODOP products to global level with a
 structured approach.</span></li>
 </ul>
 </article>
 <article className="static-card">
 <h3>What are the ODOP Schemes?</h3>
 <ul className="static-list">
 <li><i className="fas fa-angle-right"></i><span>Common Facility Centre Scheme</span></li>
 <li><i className="fas fa-angle-right"></i><span>Marketing Development Assistance Scheme</span></li>
 <li><i className="fas fa-angle-right"></i><span>Finance Assistance Scheme (Margin Money
 Scheme)</span></li>
 <li><i className="fas fa-angle-right"></i><span>Skill Development Scheme</span></li>
 </ul>
 </article>
 <article className="static-card">
 <h3>What is the Marketing Development Assistance (MDA) scheme under ODOP?</h3>
 <p>This scheme is aimed at fair pricing for artisans, weavers, entrepreneurs and exporters through
 better marketing. It provides financial assistance for participation in national and
 international fairs/exhibitions.</p>
 <p>Reference: <Link className="cfc-link-btn"
 href="/odop-schemes/marketing-development-assistance-scheme-uttar-pradesh">Marketing Development Assistance Scheme</Link></p>
 </article>
 <article className="static-card">
 <h3>What is the Margin Money / Financial Assistance Scheme?</h3>
 <p>Under the scheme, nationalized banks, regional rural banks and other scheduled banks finance
 enterprises and ODOP margin money subsidy is released against applications.</p>
 <ul className="static-list">
 <li><i className="fas fa-indian-rupee-sign"></i><span>Up to INR 25 lakhs project cost: 25% of
 project cost, capped at INR 6.25 lakhs.</span></li>
 <li><i className="fas fa-indian-rupee-sign"></i><span>INR 25-50 lakhs project cost: INR 6.25 lakhs
 or 20% of project cost, whichever is more.</span></li>
 <li><i className="fas fa-indian-rupee-sign"></i><span>INR 50-150 lakhs project cost: INR 10 lakhs or
 10% of project cost, whichever is more.</span></li>
 <li><i className="fas fa-indian-rupee-sign"></i><span>Above INR 150 lakhs project cost: 10% of
 amount, capped at INR 20 lakhs.</span></li>
 </ul>
 <p>The margin money is merged with subsidy after 2 years of successful operation.</p>
 <p>Reference: <Link className="cfc-link-btn" href="/odop-schemes/margin-money-scheme-uttar-pradesh">Finance Assistance Schemes</Link></p>
 </article>
 <article className="static-card">
 <h3>What is the Skill Development scheme under ODOP?</h3>
 <p><strong>Objective:</strong> Fulfil current and future requirements of skilled workforce across
 ODOP value chains and equip artisans/workers with advanced toolkits.</p>
 <p><strong>Eligibility:</strong></p>
 <ul className="static-list">
 <li><i className="fas fa-user-check"></i><span>Minimum age 18 years.</span></li>
 <li><i className="fas fa-user-check"></i><span>Applicant must be a resident of the district.</span>
 </li>
 <li><i className="fas fa-user-check"></i><span>No mandatory educational qualification.</span></li>
 <li><i className="fas fa-user-check"></i><span>No toolkit benefit from GoI/State in last 2
 years.</span></li>
 <li><i className="fas fa-user-check"></i><span>Only one application per family (husband and wife
 considered one family).</span></li>
 </ul>
 <p><strong>Incentives:</strong></p>
 <ul className="static-list">
 <li><i className="fas fa-award"></i><span>RPL-based certification for skilled artisans.</span></li>
 <li><i className="fas fa-award"></i><span>10-day training for unskilled artisans with
 certification.</span></li>
 <li><i className="fas fa-award"></i><span>Honorarium of Rs. 200 per day during training.</span></li>
 <li><i className="fas fa-award"></i><span>Free advanced toolkit for trained artisans.</span></li>
 </ul>
 <p>Reference: <Link className="cfc-link-btn" href="/odop-schemes/training-and-toolkit-scheme-uttar-pradesh">Skill Development Scheme</Link></p>
 </article>
 <article className="static-card">
 <h3>What is the Common Facility Centre (CFC) scheme?</h3>
 <p><strong>Objective:</strong> Establish CFCs with testing, design development, R&D,
 exhibition/selling center, raw material bank, common production/processing, logistics,
 communication support, packaging/labelling/barcoding and related value-chain facilities.</p>
 <p><strong>Eligibility:</strong> NGOs, volunteer organizations, SHGs, producer companies, private
 limited companies, LLPs and cooperatives can participate.</p>
 <p><strong>Process highlights:</strong> SPV creation, minimum 20 members with two-third linked to
 ODOP, statutory registration, state representative inclusion, no member with more than 10%
 share, and EOI-based selection.</p>
 <h4 className="!my-4">In-Principal approval of SPV by SLSC (Project less than 10 Cr)</h4>
 <div className="policy-table-wrap">
 <table className="policy-table">
 <thead>
 <tr>
 <th>S.No.</th>
 <th>Project Cost</th>
 <th>SPV Minimum Contribution</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>1</td>
 <td>Up to 4 Crores</td>
 <td>10%</td>
 </tr>
 <tr>
 <td>2</td>
 <td>More than 4 Crores and less than 8 Crores</td>
 <td>20%</td>
 </tr>
 <tr>
 <td>3</td>
 <td>More than 8 Crores and up to 10 Crores</td>
 <td>30%</td>
 </tr>
 </tbody>
 </table>
 </div>
 <h4 className="!my-4">In-Principal approval of SPV by HPC (Project more than 10 Cr)</h4>
 <div className="policy-table-wrap">
 <table className="policy-table">
 <thead>
 <tr>
 <th>S.No.</th>
 <th>Project Cost</th>
 <th>SPV Minimum Contribution</th>
 </tr>
 </thead>
 <tbody>
 <tr>
 <td>1</td>
 <td>More than 10 Cr</td>
 <td>60% contribution by state up to 9 Cr, minimum 40% by SPV</td>
 </tr>
 <tr>
 <td></td>
 <td></td>
 <td>Projects whose objective is environment protection, research & development</td>
 </tr>
 </tbody>
 </table>
 </div>
 </article>
 <article className="static-card">
 <h3>Other Important FAQs</h3>
 <ul className="static-list">
 <li><i className="fas fa-question"></i><span><strong>Is there any age criteria?</strong> Applicant
 must be 18 years or above.</span></li>
 <li><i className="fas fa-question"></i><span><strong>Who can I contact for more
 information?</strong> Toll-free 1800-1800-888 or nearest DIC.</span></li>
 <li><i className="fas fa-question"></i><span><strong>Is there any exclusive scheme for
 women?</strong> No ODOP-exclusive women-only scheme, but women can apply under Stand
 Up India.</span></li>
 <li><i className="fas fa-question"></i><span><strong>Can I avail benefits if my product is listed in
 a different district?</strong> No.</span></li>
 <li><i className="fas fa-question"></i><span><strong>How many family members can benefit?</strong>
 One member per family.</span></li>
 <li><i className="fas fa-question"></i><span><strong>If loan was already taken under similar
 government scheme?</strong> Applicant is generally not eligible under similar ODOP
 schemes.</span></li>
 <li><i className="fas fa-question"></i><span><strong>If a bank denies loan after DIC
 approval?</strong> Seek written reason from bank manager; if unresolved, approach
 Banking Ombudsman.</span></li>
 </ul>
 <p>Banking Ombudsman reference: <a className="cfc-link-btn"
 href="https://www.rbi.org.in/Scripts/bs_viewcontent.aspx?Id=159" target="_blank"
 rel="noopener">RBI Ombudsman Information</a></p>
 </article>
 </section>
 </div>
 </main>);
}
