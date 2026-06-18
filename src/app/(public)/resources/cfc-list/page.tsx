import type { Metadata } from "next";
import "@/styles/cfc-list.css";
import "@/styles/cfc-infographic.css";
import Link from "next/link";
import { fetchCfcList } from "@/services/schemes.service";
import Pagination from "@/components/shared/Pagination";
import { API_CONFIG } from "@/lib/api/config";
import { Suspense } from "react";
import CfcListSkeleton from "@/bones/CfcListSkeleton";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import { getLanguageServer } from "@/lib/language";
import { localizePathname, pickLocalized, resolveProductCategoryLabel } from "@/lib/locale";
import type { CfcItem } from "@/lib/api/cfc.types";
import PageBanner from "@/components/shared/PageBanner";
import ActionButton from "@/components/shared/ActionButton";


export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLanguageServer();
  if (lang === "hi") {
    return {
      title: "सीएफसी सूची | ओडीओपी - एक जिला एक उत्पाद",
      description:
        "सीएफसी सूची - ओडीओपी के अंतर्गत सामान्य सुविधा केंद्र। एसओपी, डैशबोर्ड लिंक और जिलेवार सीएफसी विवरण देखें।",
    };
  }
  return {
    title: "CFC List | ODOP - One District One Product",
    description:
      "CFC List - Common Facility Centres under ODOP. View SOP, dashboard links, and district-wise CFC details.",
  };
}

function getDistrictName(item: CfcItem, isHi: boolean): string {
  return pickLocalized(isHi, item.city.nameHindi, item.city.districtName);
}

function getProductCategoryName(item: CfcItem, isHi: boolean): string {
  return resolveProductCategoryLabel(item.productCategory, isHi);
}

function getCfcDetailHref(id: number, isHi: boolean): string {
  return localizePathname(`/resources/cfc-list/${id}`, isHi ? "hi" : "en");
}

async function CfcTableContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [params, lang] = await Promise.all([searchParams, getLanguageServer()]);
  const isHi = lang === "hi";
  const currentPage = Number(params.page) || 1;
  const limit = 1000;

  const { data: paginatedData } = await fetchCfcList(currentPage, limit);

  const cfcList =
    paginatedData?.data.sort((a, b) =>
      getDistrictName(a, isHi).localeCompare(getDistrictName(b, isHi), isHi ? "hi" : "en"),
    ) || [];
  const totalPages = paginatedData?.last_page || 1;
  const perPage = paginatedData?.per_page || limit;

  const functionalCfc = cfcList.filter((item) => item.status === "FUNCTIONAL");
  const underImplementationCfc = cfcList.filter((item) => item.status !== "FUNCTIONAL");

  return (
    <section className="cfc-section">
      <h2>
        {isHi
          ? "जिलेवार कार्यात्मक और कार्यान्वयनाधीन सीएफसी"
          : "District-wise Functional and Under-Implementation CFCs"}
      </h2>
      <p className="cfc-section-note">
        {isHi ? "स्थिति लेबल: " : "Status labels: "}
        <span className="status-chip functional">
          {isHi ? "कार्यात्मक" : "Functional"}
        </span>{" "}
        <span className="status-chip implementation">
          {isHi ? "कार्यान्वयनाधीन" : "Under Implementation"}
        </span>{" "}
        <span className="status-chip revision">
          {isHi ? "संशोधनाधीन" : "Under Revision"}
        </span>
      </p>
      <BoneyardSkeleton name="cfc-list" loading={false}>
        <div className="cfc-table-scroll">
          <table className="cfc-table cfc-master-table">
            <thead>
              <tr>
                <th>{isHi ? "क्र.सं." : "S.No."}</th>
                <th>{isHi ? "जिला" : "District"}</th>
                <th>{isHi ? "उत्पाद" : "Product"}</th>
                <th>{isHi ? "एसपीवी का नाम" : "SPV Name"}</th>
                <th>{isHi ? "पता" : "Address"}</th>
                <th>{isHi ? "हस्तक्षेप" : "Intervention"}</th>
                <th>{isHi ? "संपर्क" : "Contact"}</th>
                <th>{isHi ? "लिंक" : "Link"}</th>
              </tr>
            </thead>
            <tbody>
              {cfcList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data-cell">
                    <div className="no-data-found">
                      <p>{isHi ? "कोई सीएफसी डेटा नहीं मिला।" : "No CFC data found."}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {functionalCfc.map((item, index) => {
                    const districtName = getDistrictName(item, isHi);
                    const spvName = pickLocalized(isHi, item.spv_name_hindi, item.spv_name);
                    const address = pickLocalized(isHi, item.address_hindi, item.address);
                    const intervention = pickLocalized(isHi, item.intervention_hindi, item.intervention);

                    return (
                      <tr key={item.id || index}>
                        <td>{(currentPage - 1) * perPage + index + 1}</td>
                        <td>
                          {item.id ? (
                            <Link
                              className="district-link"
                              href={getCfcDetailHref(item.id, isHi)}
                            >
                              {districtName}
                            </Link>
                          ) : (
                            <span className="district-link">{districtName}</span>
                          )}
                        </td>
                        <td>{getProductCategoryName(item, isHi)}</td>
                        <td>{spvName}</td>
                        <td>{address}</td>
                        <td>{intervention}</td>
                        <td>{item.contact_number}</td>
                        <td>
                          {item.cfc_attachment && (
                            <a
                              className="cfc-pdf-btn"
                              href={API_CONFIG.NEW_BASE_URL + item.cfc_attachment}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fas fa-file-pdf"></i>
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {underImplementationCfc.length > 0 && (
                    <>
                      <tr className="section-row">
                        <td colSpan={8}>
                          {isHi ? "कार्यान्वयनाधीन सीएफसी" : "CFCs Under Implementation"}
                        </td>
                      </tr>
                      {underImplementationCfc.map((item, index) => {
                        const districtName = getDistrictName(item, isHi);
                        const spvName = pickLocalized(isHi, item.spv_name_hindi, item.spv_name);
                        const address = pickLocalized(isHi, item.address_hindi, item.address) || "-";
                        const intervention =
                          pickLocalized(isHi, item.intervention_hindi, item.intervention) || "-";

                        return (
                          <tr key={item.id || index}>
                            <td>{(currentPage - 1) * perPage + functionalCfc.length + index + 1}</td>
                            <td>{districtName}</td>
                            <td>{getProductCategoryName(item, isHi)}</td>
                            <td>{spvName}</td>
                            <td>{address}</td>
                            <td>{intervention}</td>
                            <td>{item.contact_number || "-"}</td>
                            <td>
                              {item.cfc_attachment && (
                                <a
                                  className="cfc-pdf-btn"
                                  href={API_CONFIG.NEW_BASE_URL + item.cfc_attachment}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <i className="fas fa-file-pdf"></i>
                                </a>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </BoneyardSkeleton>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={localizePathname("/resources/cfc-list", isHi ? "hi" : "en")}
        searchParams={params}
      />
    </section>
  );
}

export default async function CfcListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const lang = await getLanguageServer();
  const isHi = lang === "hi";

  return (
    <div className="cfc-list-page">
      <PageBanner
        imageSrc="/assets/img/banner/knowledge_hub_banner_image.png"
        eyebrow={isHi ? "ज्ञान केंद्र" : "Knowledge Hub"}
        current={isHi ? "सीएफसी सूची" : "CFC List"}
      />

      <main className="cfc-page section">
        <div className="container">
          <div className="cfc-capsule-heading-wrap">
            <h1 className="resource-heading-common">
              {isHi ? "सामान्य सुविधा केंद्र (सीएफसी)" : "Common Facility Centre (CFC)"}
            </h1>
          </div>

          <section className="cfc-section">
            <h2>{isHi ? "एसओपी और डैशबोर्ड" : "SOP and Dashboard"}</h2>
            <div>
              <div className="cfc-sop-block">
                <div className="cfc-sop-card">
                  <div className="cfc-sop-card-body">
                    <ul className="cfc-sop-card-meta">
                      <li>
                        <span className="cfc-sop-meta-label">
                          {isHi ? "भाषा" : "Language"}
                        </span>
                        <span className="cfc-sop-meta-value">
                          {isHi ? "अंग्रेज़ी" : "English"}
                        </span>
                      </li>
                      <li>
                        <span className="cfc-sop-meta-label">
                          {isHi ? "अपलोड तिथि" : "Uploaded On"}
                        </span>
                        <span className="cfc-sop-meta-value">04-03-2025</span>
                      </li>
                    </ul>
                  </div>
                  <ActionButton
                    href="/assets/document/pdf-attachment/639172211308429385.pdf"
                    external
                    className="cfc-sop-card-btn"
                  >
                    {isHi ? "देखें / डाउनलोड" : "View / Download"}
                  </ActionButton>
                </div>
              </div>
              {/* <div className="table-wrap">
                <h3 className="cfc-table-title">
                  {isHi ? "सीएफसी डैशबोर्ड" : "CFC Dashboard"}
                </h3>
                <div className="cfc-table-scroll">
                  <table className="cfc-table cfc-table-compact">
                    <thead>
                      <tr>
                        <th>{isHi ? "क्र.सं." : "Sr. No."}</th>
                        <th>{isHi ? "विषय" : "Subject"}</th>
                        <th>{isHi ? "एक्सेस" : "Access"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>
                          {isHi ? "सीएफसी डैशबोर्ड (पावर BI)" : "CFC Dashboard (Power BI)"}
                        </td>
                        <td>
                          <a
                            className="cfc-link-btn"
                            href="https://app.powerbi.com/view?r=eyJrIjoiYTBkMDY1MDAtMGYxZS00Njc0LTg5YTctMWVjMTBmZTcyMDJkIiwidCI6IjYxYTc2OTA5LTllOWUtNDllOC1hZmViLTU0NmZiMjcxN2ZhNyJ9"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {isHi ? "देखें" : "View"}
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
            </div>
          </section>

          <Suspense fallback={<CfcListSkeleton />}>
            <CfcTableContent searchParams={searchParams} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
