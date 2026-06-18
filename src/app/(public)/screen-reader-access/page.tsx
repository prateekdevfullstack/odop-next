import type { Metadata } from "next";

export const metadata: Metadata = {
 title: "Screen Reader Access | One District One Product",
 description:
 "Accessibility information and screen reader compatibility details for the ODOP website.",
};

const screenReaders = [
 {
 name: "Screen Access For All (SAFA)",
 website: "http://safa-reader.software.informer.com/download/",
 type: "Free",
 },
 {
 name: "Non Visual Desktop Access (NVDA)",
 website: "http://www.nvda-project.org/",
 type: "Free",
 },
 {
 name: "System Access To Go",
 website: "http://www.satogo.com/",
 type: "Free",
 },
 {
 name: "Thunder",
 website: "http://www.screenreader.net/index.php?pageid=11",
 type: "Free",
 },
 {
 name: "Hal",
 website: "http://www.yourdolphin.co.uk/productdetail.asp?id=5",
 type: "Commercial",
 },
 {
 name: "JAWS",
 website: "http://www.freedomscientific.com/jaws-hq.asp",
 type: "Commercial",
 },
 {
 name: "Supernova",
 website: "http://www.yourdolphin.co.uk/productdetail.asp?id=1",
 type: "Commercial",
 },
 {
 name: "Window-Eyes",
 website: "http://www.gwmicro.com/Window-Eyes/",
 type: "Commercial",
 },
];

export default function ScreenReaderAccessPage() {
 return (<main className="main-content schemes-page">
 <section className="page-hero about-hero">
 <div className="page-hero-overlay" />
 <div className="container page-hero-content">
 <h1 className="page-hero-title">Screen Reader Access</h1>
 <p className="page-hero-subtitle">
 Accessibility support information for users with visual impairments.
 </p>
 </div>
 </section>

 <section className="section section-surface-white">
 <div className="container">
 <div className="section-header">
 <h2>Accessibility Compliance</h2>
 <p>
 One District One Product website complies with World Wide Web Consortium (W3C)
 Web Content Accessibility Guidelines (WCAG) 2.0 level AA. <br/>This helps people with visual
 impairments access the website through assistive technologies such as screen readers.
 </p>
 <p>
 The information available on this website is accessible through different screen readers.
 </p>
 <div className="divider"><span></span><span></span><span></span></div>
 </div>

 <h3 style={{ marginBottom: "16px" }}>Various Screen Readers to choose from</h3>

 <div style={{ overflowX: "auto" }}>
 <table style={{ width: "100%", borderCollapse: "collapse" }}>
 <thead>
 <tr>
 <th style={cellHeaderStyle}>Screen Reader</th>
 <th style={cellHeaderStyle}>Website</th>
 <th style={cellHeaderStyle}>Free / Commercial</th>
 </tr>
 </thead>
 <tbody>
 {screenReaders.map((reader) => (<tr key={reader.name}>
 <td style={cellBodyStyle}>{reader.name}</td>
 <td style={cellBodyStyle}>
 <a href={reader.website} target="_blank" rel="noopener noreferrer">
 {reader.website}
 </a>
 </td>
 <td style={cellBodyStyle}>{reader.type}</td>
 </tr>))}
 </tbody>
 </table>
 </div>
 </div>
 </section>
 </main>);
}

const cellHeaderStyle: React.CSSProperties = {
 border: "1px solid #d5dbe7",
 background: "#f4f6fa",
 textAlign: "left",
 padding: "10px",
 fontWeight: 600,
};

const cellBodyStyle: React.CSSProperties = {
 border: "1px solid #d5dbe7",
 padding: "10px",
 verticalAlign: "top",
};
