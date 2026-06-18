import Link from "next/link";
import "@/styles/gi-products.css";
import GIProductCard from "@/components/GIProductCard";
import { getLanguageServer } from "@/lib/language";
import { localizePathname } from "@/lib/locale";
import type { GIProductCardData } from "@/services/gi-products.service";
import CapsuleHeading from "../shared/CapsuleHeading";

type GIProductsSectionProps = {
  products: GIProductCardData[];
};

export default async function GIProductsSection({ products }: GIProductsSectionProps) {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  if (products.length === 0) {
    return null;
  }

  const viewAllHref = localizePathname("/gi-products", isHi ? "hi" : "en");

  return (
    <section
      id="gi-products"
      aria-label={
        isHi ? "भौगोलिक संकेत (जीआई) उत्पाद" : "Geographical Indications (GI) Products"
      }
      className="gi-section"
    >
      <div className="container">
        {/* <div className="gi-heading-pill reveal">
          <span className="gi-heading-text">
            {isHi
              ? "भौगोलिक संकेत (जीआई) उत्पाद"
              : "Geographical Indications (GI) Products"}
          </span>
        </div> */}

        <CapsuleHeading reveal className="mb-20">
        {isHi
              ? "भौगोलिक संकेत (जीआई) उत्पाद"
              : "Geographical Indications (GI) Products"}
        </CapsuleHeading>


        <div className="gi-grid reveal" role="list">
          {products.map((product, index) => (
            <div key={product.id} role="listitem">
              <GIProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        <div className="ms-footer reveal">
          <Link href={viewAllHref} className="ms-view-all">
            {isHi ? "सभी देखें" : "View All"}
          </Link>
        </div>

      </div>

      <style>{`
        .gi-section {
          scroll-margin-top: 140px;
          padding: clamp(36px, 6vw, 60px) 0;
        }

        .gi-section > .container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap:  clamp(24px, 4vw, 60px);
        }

        // .gi-heading-pill {
        //   box-sizing: border-box;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   padding: clamp(12px, 2vw, 22px) clamp(20px, 4vw, 40px);
        //   width: 100%;
        //   background: #8a231c;
        //   border: 1px solid rgba(179, 84, 0, 0.08);
        //   box-shadow: 0 0 30px rgba(15, 23, 42, 0.06);
        //   border-radius: 1000px;
        // }

        // .gi-heading-text {
        //   font-family: "Montserrat", sans-serif;
        //   font-weight: 600;
        //   font-size: clamp(1rem, 2.2vw, 1.625rem);
        //   line-height: 135%;
        //   text-transform: uppercase;
        //   color: #ffffff;
        //   text-align: center;
        // }

        .gi-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(16px, 2.2vw, 24px);
          align-items: stretch;
        }

        .gi-grid > * {
          min-width: 0;
          height: 100%;
        }

        // .gi-action {
        //   display: flex;
        //   justify-content: center;
        // }

        // .gi-view-all {
        //   display: inline-flex;
        //   align-items: center;
        //   justify-content: center;
        //   padding: 20px 29px;
        //   border-radius: 18px;
        //   background: #d1d1d1;
        //   font-family: "Poppins", sans-serif;
        //   font-weight: 600;
        //   font-size: 1rem;
        //   line-height: 1;
        //   color: #363636;
        //   text-decoration: none;
        //   transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        // }

        // .gi-view-all:hover {
        //   transform: translateY(-2px);
        //   background: #c4c4c4;
        //   box-shadow: 0 8px 20px rgba(17, 24, 39, 0.12);
        // }

        // .gi-view-all:focus-visible {
        //   outline: 2px solid #b35400;
        //   outline-offset: 3px;
        // }

        @media (max-width: 1200px) {
          .gi-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .gi-section {
            padding: clamp(28px, 7vw, 40px) 0;
          }

          .gi-section > .container {
            gap: clamp(16px, 5vw, 24px);
          }

          .gi-heading-text {
            font-size: clamp(0.9rem, 4vw, 1.25rem);
          }

          .gi-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
        }
      `}</style>
    </section>
  );
}
