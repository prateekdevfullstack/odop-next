import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
 title: "Chief Minister's Message | About ODOP",
 description:
 "Chief Minister's message for ODOP — vision and guidance for strengthening artisans, MSMEs, and district enterprise ecosystems.",
};

export default function ChiefMinisterMessagePage() {
 return (<main className="main-content schemes-page about-static-page message-page">
 <section className="page-hero-section">
 <div className="page-hero-wrapper">
 <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New4.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
 <div className="page-hero-overlay" />
 <div className="page-hero-content">
 <h1 className="page-hero-title">About</h1>
 <div className="breadcrumb"><span className="text-white">Home</span><span className="separator">&gt;</span><span className="active">Chief Minister&apos;s Message</span></div>
 </div>
 </div>
 </section>

 <div className="container">
 <div className="section-header">
 <span className="eyebrow">Leadership Message</span>
 <h2>Message from the Hon&apos;ble Chief Minister</h2>
 <p>
 Vision and guidance for strengthening artisans, MSMEs, and
 district-level enterprise through ODOP.
 </p>
 <div className="divider">
 <span /><span /><span />
 </div>
 </div>

 <section className="message-shell">
 <aside className="message-profile cm-theme">
 <Image
 src="/assets/img/CM-Yogi-Adityanath.jpg"
 alt="Shri Yogi Adityanath"
 width={300}
 height={400}
 />
 <h3>श्री योगी आदित्यनाथ</h3>
 <p>माननीय मुख्यमंत्री, उत्तर प्रदेश</p>
 </aside>

 <article className="message-content">
 <h3>Official Statement</h3>
 <span className="message-badge cm-badge">
 <i className="fas fa-feather-pointed" aria-hidden="true" /> Chief
 Minister&apos;s Message
 </span>
 <div className="hindi-block">
 <p>
 मुझे यह जानकर अत्यंत प्रसन्नता की अनुभूति हो रही है कि दिनांक
 10 अगस्त, 2018 को लखनऊ में &apos;वन डिस्ट्रिक्ट-वन
 प्रोडक्ट&apos; समिट का आयोजन किया जा रहा है। उत्तर प्रदेश
 प्राकृतिक एवं मानवीय संसाधनों की दृष्टि से विकास की अपार
 संभावनाओं को समेटे हुए है।
 </p>
 <p>
 इन संसाधनों का कुशलतम उपयोग करते हुए प्रदेश के समग्र एवं
 समावेशी आर्थिक विकास तथा जनमानस के जीवन स्तर के उन्नयन के
 उद्देश्य से राज्य सरकार द्वारा दिनांक 24 जनवरी, 2018 को उत्तर
 प्रदेश दिवस के अवसर पर &apos;एक जनपद-एक उत्पाद&apos; कार्यक्रम
 प्रारंभ किया गया है।
 </p>
 <p>
 &apos;एक जनपद-एक उत्पाद&apos; कार्यक्रम के बहुआयामी लाभों के
 दृष्टिगत प्रदेश सरकार इसके सफल एवं प्रभावी क्रियान्वयन हेतु
 गंभीरता से प्रयास कर रही है। भारत सरकार तथा राज्य सरकार द्वारा
 संचालित विभिन्न योजनाओं जैसे प्रधानमंत्री रोजगार सृजन
 कार्यक्रम, मुद्रा योजना, मुख्यमंत्री युवा स्वरोजगार योजना,
 विश्वकर्मा श्रम सम्मान आदि के साथ &apos;एक जनपद-एक
 उत्पाद&apos; कार्यक्रम का समन्वय करते हुए कार्यक्रम से जुड़े
 हितधारकों के साथ क्रियान्वयन के विविध पहलुओं पर
 विचार-विमर्श किया जा रहा है।
 </p>
 <p>
 तदनुरूप विकास रणनीति के निर्धारण हेतु &apos;एक जनपद-एक
 उत्पाद&apos; समिट का आयोजन किया जा रहा है। इस समिट में &apos;एक
 जनपद-एक उत्पाद&apos; कार्यक्रम के अंतर्गत विभिन्न जनपदों के
 चयनित उत्पादों के विकास से जुड़ी नयी योजनाओं का शुभारंभ किया
 जाएगा तथा उत्पादों की ब्राण्डिंग एवं लोकप्रियता बढ़ाने हेतु
 प्रदर्शनी तथा लाइव डेमो भी आयोजित किए जाएंगे।
 </p>
 <p>
 आयोजन के दौरान डिजाइन डेवलपमेंट सहित विभिन्न चुनौतियों एवं
 अवसरों पर विशेषज्ञों के साथ तकनीकी सत्र, मुद्रा ऋण वितरण आदि
 कार्यक्रम भी सम्पन्न होंगे। मुझे विश्वास है कि &apos;एक
 जनपद-एक उत्पाद&apos; कार्यक्रम के सफल क्रियान्वयन में यह समिट
 अत्यंत उपयोगी एवं मार्ग-दर्शक सिद्ध होगी।
 </p>
 <p>
 &apos;एक जनपद-एक उत्पाद&apos; समिट की सफलता हेतु मेरी हार्दिक
 शुभकामनाएं।
 </p>
 </div>
 </article>
 </section>
 </div>
 </main>);
}
