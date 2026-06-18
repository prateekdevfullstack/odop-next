import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
 title: "Minister's Message | About ODOP",
 description:
 "Minister's message for ODOP — policy direction and implementation priorities for ODOP-linked industry growth, skills, and market development.",
};

export default function MinisterMessagePage() {
 return (<main className="main-content schemes-page about-static-page message-page">
 <section className="page-hero-section">
 <div className="page-hero-wrapper">
 <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
 <div className="page-hero-overlay" />
 <div className="page-hero-content">
 <h1 className="page-hero-title">About</h1>
 <div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Minister&apos;s Message</span></div>
 </div>
 </div>
 </section>

 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Policy Direction</span>
 <h2>Message from the Hon&apos;ble Minister</h2>
 <p>
 Departmental priorities for implementation, employment generation,
 and market development under ODOP.
 </p>
 <div className="divider">
 <span /><span /><span />
 </div>
 </div>

 <section className="message-shell">
 <aside className="message-profile minister-theme">
 <Image
 src="/assets/img/Minister-Shri-Rakesh-Sachan.jpg"
 alt="Shri Rakesh Sachan"
 width={300}
 height={400}
 />
 <h3>श्री राकेश सचान</h3>
 <p>
 मा0 कैबिनेट मंत्री, सूक्ष्म, लघु एवं मध्यम उद्यम, खादी एवं
 ग्रामोद्योग, रेशम उद्योग, हथकरघा एवं वस्त्रोद्योग, उत्तर प्रदेश
 </p>
 </aside>

 <article className="message-content">
 <h3>Official Statement</h3>
 <span className="message-badge minister-badge">
 <i className="fas fa-briefcase" aria-hidden="true" /> Minister&apos;s Message
 </span>
 <div className="hindi-block">
 <p>
 प्रदेश के समग्र विकास हेतु प्रदेश सरकार कृतसंकल्प एवं निरन्तर
 प्रयत्नशील है। सरकार द्वारा &apos;सूक्ष्म, लघु एवं मध्यम उद्यम
 नीति&apos; तथा &apos;अवस्थापना एवं औद्योगिक विकास नीति&apos; का
 प्रख्यापन करते हुए उद्यमी हितैषी नीतियों एवं योजनाओं का
 क्रियान्वयन किया जा रहा है।
 </p>
 <p>
 राज्य में विशाल मानव संसाधन की ऊर्जा, परम्परागत कारीगरों की
 कुशलता तथा प्रत्येक जनपद के एकाधिक उत्पाद विशेष की प्रसिद्धि
 अथवा विकास की सम्भावनाशीलता है। इस क्रम में माननीय मुख्यमंत्री
 जी की प्रेरणा एवं मार्ग-दर्शन से प्रदेश के सर्वागीण विकास के
 उद्देश्य से &apos;एक जनपद एक उत्पाद&apos; कार्यक्रम का शुभारम्भ
 किया गया।
 </p>
 <p>
 इसका मुख्य उद्देश्य स्थानीय स्तर पर रोजगार सृजन, उत्पाद विकास
 हेतु वित्त पोषण, प्रशिक्षण, तकनीकी सहयोग, विपणन सुविधाएं आदि
 उपलब्ध कराते हुए राष्ट्रीय एवं अन्तर्राष्ट्रीय बाजारों में
 ब्राण्ड उत्तर प्रदेश को स्थापित करना है।
 </p>
 <p>
 भारत सरकार तथा राज्य सरकार की रोजगार सृजन, कौशल विकास एवं वित्त
 पोषण की योजनाओं के साथ समन्वय करते हुए कार्यक्रम के उद्देश्यों
 की पूर्ति हेतु विभाग निरन्तर प्रयत्नशील है। इसी कड़ी में
 कार्यक्रम के हित धारकों के साथ &apos;एक जनपद-एक उत्पाद
 समिट&apos; का आयोजन किया जा रहा है।
 </p>
 <p>
 इसमें नयी योजनाओं के शुभारम्भ के साथ वित्त पोषण, प्रशिक्षण, तकनीकी सहयोग, विपणन, उत्पाद विकास आदि विषयों पर विशेषज्ञों के साथ विचार-विमर्श किया जायेगा। मैं &apos;एक जनपद-एक उत्पाद समिट&apos; के आयोजन हेतु माननीय मुख्यमंत्री जी की प्रगतिशील एवं जनोपयोगी दृष्टिकोण के प्रति आभार प्रकट करता हूँ एवं उनके कुशल नेतृत्व में इस कार्यक्रम के उद्देश्यों को पूरा करने का संकल्प लेता हूँ।
 </p>
 <p>
 मैं माननीय मुख्यमंत्री जी को विश्वास दिलाता हूँ कि इस कार्यक्रम का लाभ सभी हितधारकों तक पहुँचाया जायेगा ताकि प्रदेश में संतुलित तरीके से लघु उद्यमों का विकास होता रहे। साथ ही इस कार्यक्रम के सफल आयोजन हेतु शुभकामनाएं प्रेषित करता हूँ।
 </p>
 </div>
 </article>
 </section>
 </div>
 </main>);
}
