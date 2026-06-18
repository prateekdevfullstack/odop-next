import type { Metadata } from "next";
import "@/styles/nabl-labs.css";
import { Suspense } from "react";
import { fetchNablLabsList } from "@/services/schemes.service";
import Pagination from "@/components/shared/Pagination";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import NablLabsListSkeleton from "@/bones/NablLabsListSkeleton";
import { getLanguageServer } from "@/lib/language";
import { localizePathname, pickLocalized, resolveProductCategoryLabel } from "@/lib/locale";
import type { TestingLaboratory } from "@/lib/api/nabl-labs.types";
import PageBanner from "@/components/shared/PageBanner";

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "NABL प्रयोगशालाओं की सूची | संसाधन | ओडीओपी",
      description:
        "ओडीओपी उत्पादों के परीक्षण, अंशांकन और प्रमाणन के लिए NABL-मान्यता प्राप्त प्रयोगशालाएं।",
    };
  }
  return {
    title: "List of NABL Labs | Resources | ODOP",
    description:
      "NABL-accredited laboratories for testing, calibration and certification of ODOP products.",
  };
}

function getProductName(lab: TestingLaboratory, isHi: boolean): string {
  if (!lab.product) return "";
  return resolveProductCategoryLabel(lab.product, isHi);
}

function getDistrictName(lab: TestingLaboratory, isHi: boolean): string {
  return (
    pickLocalized(isHi, lab.district_hindi, lab.district) ||
    lab.city?.districtName ||
    ""
  );
}

async function NablLabsTableContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, lang] = await Promise.all([searchParams, getLanguageServer()]);
  const isHi = lang === "hi";
  const currentPage = Number(params.page) || 1;
  const limit = 100;

  const { data: apiResponse } = await fetchNablLabsList(currentPage, limit);

  const nablLabs =
    apiResponse?.data
      .filter((lab) => !lab.isDeleted)
      .sort((a, b) => {
        const categoryCompare = getProductName(a, isHi).localeCompare(
          getProductName(b, isHi),
          isHi ? "hi" : "en",
        );
        if (categoryCompare !== 0) return categoryCompare;
        return getDistrictName(a, isHi).localeCompare(getDistrictName(b, isHi), isHi ? "hi" : "en");
      }) || [];

  const totalPages = apiResponse?.pagination?.totalPages || 1;
  const perPage = apiResponse?.pagination?.limit || limit;

  return (
    <section className="nabl-section">
      <h2>
        {isHi
          ? "जिलेवार NABL-मान्यता प्राप्त प्रयोगशालाएं"
          : "District-wise NABL-Accredited Laboratories"}
      </h2>
      <BoneyardSkeleton name="nabl-labs-list" loading={false}>
        <div className="nabl-table-scroll">
          <table className="nabl-table">
            <thead>
              <tr>
                <th>{isHi ? "क्र.सं." : "S. No."}</th>
                <th>{isHi ? "ओडीओपी श्रेणी" : "ODOP Category"}</th>
                <th>{isHi ? "CAB ID" : "CAB ID"}</th>
                <th>{isHi ? "प्रयोगशाला का नाम" : "Laboratory Name"}</th>
                <th>{isHi ? "पता" : "Address"}</th>
                <th>{isHi ? "जिला" : "District"}</th>
                <th>{isHi ? "अनुशासन" : "Discipline"}</th>
              </tr>
            </thead>
            <tbody>
              {nablLabs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data-cell">
                    <div className="no-data-found">
                      <i className="fas fa-microscope"></i>
                      <p>{isHi ? "कोई NABL प्रयोगशाला नहीं मिली।" : "No NABL labs found."}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                nablLabs.map((lab, index) => {
                  const labName = pickLocalized(isHi, lab.lab_name_hindi, lab.lab_name);
                  const address = pickLocalized(isHi, lab.address_hindi, lab.address);
                  const discipline =
                    lab.discipline?.length > 0 ? lab.discipline.join(", ") : "—";

                  return (
                    <tr key={lab.id}>
                      <td style={{ textAlign: "center", fontWeight: "600", color: "#153b66" }}>
                        {(currentPage - 1) * perPage + index + 1}
                      </td>
                      <td>
                        <span className="category-chip">{getProductName(lab, isHi)}</span>
                      </td>
                      <td className="cab-id">{lab.lab_code}</td>
                      <td style={{ fontWeight: "500", color: "#1f324a" }}>{labName}</td>
                      <td style={{ color: "#4a6078" }}>{address}</td>
                      <td style={{ fontWeight: "500" }}>{getDistrictName(lab, isHi)}</td>
                      <td style={{ color: "#4a6078" }}>{discipline}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </BoneyardSkeleton>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={localizePathname("/resources/nabl-labs", isHi ? "hi" : "en")}
        searchParams={params}
      />

      <p className="source-note">
        {isHi ? "स्रोत: " : "Source: "}
        {isHi
          ? "राष्ट्रीय परीक्षण और अंशांकन प्रयोगशालाएं मान्यता बोर्ड (NABL)।"
          : "National Accreditation Board for Testing and Calibration Laboratories (NABL)."}
        {isHi ? " नवीनतम मान्यता स्थिति के लिए, " : " For the latest accreditation status, visit "}
        <a href="https://www.nabl-india.org" target="_blank" rel="noopener noreferrer">
          www.nabl-india.org
        </a>
        .
      </p>
    </section>
  );
}

export default async function NablLabsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <div className="nabl-labs-page">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "ज्ञान केंद्र" : "Knowledge Hub"}
        current={isHi ? "एनएबीएल प्रयोगशालाओं की सूची" : "List of NABL Labs"}
      />

      <main className="nabl-main-content section">
        <div className="container">
          <div className="resource-capsule-heading-wrap">
            <h1 className="resource-heading-common">
              {isHi ? "NABL प्रयोगशालाओं की सूची" : "List of NABL Labs"}
            </h1>
          </div>

          <Suspense fallback={<NablLabsListSkeleton />}>
            <NablLabsTableContent searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
