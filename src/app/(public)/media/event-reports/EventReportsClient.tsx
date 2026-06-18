"use client";

import Image from "next/image";
import BoneyardSkeleton from "@/bones/BoneyardSkeleton";
import Breadcrumb from "@/components/shared/Breadcrumb";

const PDF_BASE = "https://odopup.in/document/event-reports/";

const EVENT_REPORT_ROWS = [
  {
    no: 1,
    title: "Report Gulf Food Festival",
    meta: "Size: 1 MB | Lang: English | Uploaded: 01-03-2025",
    file: "report_gulf_food_festival.pdf",
  },
  {
    no: 2,
    title: "Report Meerut Mahotsav 2024",
    meta: "Size: 1 MB | Lang: English | Uploaded: 01-03-2025",
    file: "report_meerut_mahotsav_2024.pdf",
  },
  {
    no: 3,
    title: "Report Packaging Training",
    meta: "Size: 1 MB | Lang: English | Uploaded: 01-03-2025",
    file: "report_packaging_training.pdf",
  },
  {
    no: 4,
    title: "International Trade Show-2024",
    meta: "Size: 1 MB | Lang: English | Uploaded: 01-03-2025",
    file: "report_UP_international_trade_show-2024.pdf",
  },
  {
    no: 5,
    title: "Event Report on ODOP Regional Summit – Meerut 2019",
    meta: "Size: 389 KB | Lang: English | Uploaded: 03-05-2019",
    file: "report_ODOP_Regional_Summit_Meerut_2019.pdf",
  },
  {
    no: 6,
    title: "Event Report on ODOP Regional Summit – Agra 2019",
    meta: "Size: 389 KB | Lang: English | Uploaded: 03-05-2019",
    file: "report_on_ODOP_Regional_Summit_Agra_2019.pdf",
  },
  {
    no: 7,
    title: "Event Report on ODOP Regional Summit – Gorakhpur 2019",
    meta: "Size: 389 KB | Lang: English | Uploaded: 03-05-2019",
    file: "report_ODOP_Regional_Summit_Gorakhpur_2019.pdf",
  },
  {
    no: 8,
    title: "Event Report on ODOP Regional Summit – Varanasi 2018",
    meta: "Size: 389 KB | Lang: English | Uploaded: 03-05-2019",
    file: "report_ODOP_Regional_Summit_Varanasi_2018.pdf",
  },
  {
    no: 9,
    title: "Event Report on ODOP Regional Summit – Moradabad 2019",
    meta: "Size: 389 KB | Lang: English | Uploaded: 03-05-2019",
    file: "report_ODOP_Regional_Summit_Moradabad_2019.pdf",
  },
  {
    no: 10,
    title: "Event Report on ODOP Regional Summit – Lucknow 2018",
    meta: "Size: 389 KB | Lang: English | Uploaded: 03-05-2019",
    file: "report_ODOP_Regional_Summit_Lucknow_2018.pdf",
  },
  {
    no: 11,
    title: "Event Report on ODOP State Summit – 2018",
    file: "report_ODOP_State_Summit_Uttar_Pradesh_2018.pdf",
  },
];

export default function EventReportsClient() {
  return (
    <BoneyardSkeleton name="event-reports" loading={false}>
      <section className="page-hero-section">
        <div className="page-hero-wrapper">
          <Image src="/assets/img/banner/ODOP WEBSITE PHOTO BANNERS_New3.png" alt="" className="page-hero-image" aria-hidden={true} width={1920} height={370} />
          <div className="page-hero-overlay" />
          <div className="page-hero-content">
            <h1 className="page-hero-title">Media</h1>
            <Breadcrumb en="Event Reports" hi="कार्यक्रम रिपोर्ट" />
          </div>
        </div>
      </section>

      <main className="cfc-page section">
        <div className="container">
          <section className="cfc-section">
            <h2>Event Reports</h2>
            <div className="cfc-table-scroll">
              <table className="cfc-table cfc-master-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Subjects</th>
                    <th>Status / Link</th>
                  </tr>
                </thead>
                <tbody>
                  {EVENT_REPORT_ROWS.map((row) => (
                    <tr key={row.no}>
                      <td>{row.no}</td>
                      <td>
                        {row.title}
                        {row.meta ? (
                          <>
                            <br />
                            <small>{row.meta}</small>
                          </>
                        ) : null}
                      </td>
                      <td>
                        <a
                          className="cfc-pdf-btn"
                          href={`${PDF_BASE}${row.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-file-pdf" /> View PDF
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </BoneyardSkeleton>
  );
}
