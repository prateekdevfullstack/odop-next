import DistrictProductsCarousel from "@/components/home/DistrictProductsCarousel";
import { getLanguageServer } from "@/lib/language";
import type { PublicDistrict } from "@/lib/api/districts.types";
import CapsuleHeading from "../shared/CapsuleHeading";

type DistrictProductsSectionProps = {
  districts: PublicDistrict[];
};

export default async function DistrictProductsSection({
  districts,
}: DistrictProductsSectionProps) {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <section
      id="district-products"
      aria-label={isHi ? "जिलेवार ओडीओपी उत्पाद" : "District-wise ODOP Products"}
      className="dp-section district-grid-identical"
    >
      <div className="container">
        {/* <div className="dp-heading-pill reveal">
          <span className="dp-heading-text">
            {isHi ? "जिला-वार ओडीओपी उत्पाद" : "District-Wise ODOP Products"}
          </span>
        </div> */}

        <CapsuleHeading reveal>
            {isHi ? "जिलेवार ओडीओपी उत्पाद" : "District-Wise ODOP Products"}
        </CapsuleHeading>


        <DistrictProductsCarousel districts={districts} />
      </div>

      <style>{`
        .dp-section {
          scroll-margin-top: 140px;
           padding: clamp(36px, 6vw, 60px) 0;
        }

        .dp-section > .container {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(24px, 4vw, 60px);
        }

        // .dp-heading-pill {
        //   box-sizing: border-box;
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        //   padding: clamp(12px, 2vw, 22px) clamp(20px, 4vw, 40px);
        //   width: 100%;
        //   background: #8A231C;
        //   border: 1px solid rgba(179, 84, 0, 0.08);
        //   box-shadow: 0 0 30px rgba(15, 23, 42, 0.06);
        //   border-radius: 1000px;
        // }

        // .dp-heading-text {
        //   font-family: "Montserrat", sans-serif;
        //   font-weight: 600;
        //   font-size: clamp(1rem, 2.2vw, 1.625rem);
        //   line-height: 135%;
        //   text-transform: uppercase;
        //   color: #ffffff;
        //   text-align: center;
        // }

        .dp-intro {
          margin: 0 auto;
          max-width: 720px;
          font-family: "Poppins", sans-serif;
          font-size: clamp(0.875rem, 1.4vw, 1.04rem);
          line-height: 1.65;
          color: #718096;
          text-align: center;
        }

        .dp-action {
          display: flex;
          justify-content: center;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .dp-section {
            padding: clamp(32px, 6.5vw, 48px) 0;
          }

          .dp-section > .container {
            gap: clamp(18px, 4vw, 24px);
          }
        }

        @media (max-width: 640px) {
          .dp-section {
            padding: clamp(28px, 7vw, 40px) 0;
          }

          .dp-section > .container {
            gap: clamp(16px, 5vw, 24px);
          }

          .dp-heading-text {
            font-size: clamp(0.9rem, 4vw, 1.25rem);
          }

          .dp-intro {
            font-size: clamp(0.85rem, 3.5vw, 0.95rem);
          }
        }
      `}</style>
    </section>
  );
}
