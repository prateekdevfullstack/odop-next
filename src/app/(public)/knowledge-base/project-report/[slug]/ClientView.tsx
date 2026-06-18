"use client";

import { useState, useEffect } from "react";
import { API_CONFIG } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";

type ProjectReportItem = {
  id: number;
  title: string;
  project_value: string;
  slug: string;
  hindi_title: string;
  file: string;
  type: string;
  price: string;
  associate_amount: string;
  short_description: string;
  description: string | null;
  hindi_short_description: string;
  hindi_description: string | null;
  thumbnail: string;
  hindi_thumbnail: string;
  laravel_through_key: number;
  is_purchased: any;
};

export type ProjectReportGroup = {
  id: number;
  name: string;
  hindi_name: string;
  slug: string;
  thumbnail: string;
  hindi_thumbnail: string;
  projectreport: ProjectReportItem[];
};

interface ClientViewProps {
  slug: string;
  reportGroups: ProjectReportGroup[];
}

export default function ClientView({ slug, reportGroups }: ClientViewProps) {
  const lang = useLanguage();
  const isHi = lang === "hi";
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePreviewLabel, setActivePreviewLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!activePdfUrl && reportGroups.length > 0) {
      for (const group of reportGroups) {
        if (group.projectreport && group.projectreport.length > 0) {
          const firstReport = group.projectreport.find(r => r.file);
          if (firstReport) {
            setActivePdfUrl(`${API_CONFIG.IMAGE_BASE_URL}${firstReport.file}`);
            const groupName = isHi && group.hindi_name ? group.hindi_name : group.name;
            const reportTitle = isHi && firstReport.hindi_title ? firstReport.hindi_title : firstReport.title;
            const label = isHi ? `${reportTitle} (पीडीएफ)` : `${reportTitle} (PDF)`;
            setActivePreviewLabel(`${groupName} — ${label}`);
            break;
          }
        }
      }
    }
  }, [reportGroups, activePdfUrl, isHi]);

  const handlePdfClick = (fileUrl: string, label: string) => {
    setActivePdfUrl(`${API_CONFIG.IMAGE_BASE_URL}${fileUrl}`);
    setActivePreviewLabel(label);
  };

  if (!reportGroups || reportGroups.length === 0) {
    return (
      <div className="kb-pr-detail-page">
        <div className="container kb-pr-detail-empty-full">
            <p>{isHi ? `हमें "${slug}" के लिए कोई परियोजना रिपोर्ट नहीं मिली।` : `We could not find a project report for "${slug}".`}</p>
            <a href={isHi ? "/hi/knowledge-base/project-report" : "/knowledge-base/project-report"} className="btn btn-primary">
              {isHi ? "परियोजना रिपोर्ट पर वापस जाएं" : "Back to project reports"}
            </a>
        </div>
      </div>
    );
  }

  const mainGroup = reportGroups[0];
  const mainGroupName = isHi && mainGroup.hindi_name ? mainGroup.hindi_name : mainGroup.name;

  return (
    <div className="kb-pr-detail-page">
      <div className="kb-pr-detail-layout-wrap">
        <div className="container kb-pr-detail-layout">
          
          <aside className="kb-pr-detail-preview-col" aria-label="PDF preview">
            <div className="kb-pr-detail-preview-head">
              <i className="fas fa-file-pdf" aria-hidden="true"></i>
              <span>{activePreviewLabel || (isHi ? "दस्तावेज़ पूर्वावलोकन" : "Document preview")}</span>
            </div>
            <div className="kb-pr-detail-preview-box">
              {activePdfUrl ? (
                <iframe 
                  src={activePdfUrl} 
                  className="kb-pr-detail-iframe" 
                  title={isHi ? "चयनित पीडीएफ पूर्वावलोकन" : "Selected PDF preview"}
                ></iframe>
              ) : (
                <div className="kb-pr-detail-pdf-placeholder" role="status">
                  <i className="fas fa-file-pdf" aria-hidden="true"></i>
                  <span>
                    {isHi 
                      ? "यहाँ पूर्वावलोकन करने के लिए दाईं ओर एक मॉड्यूल पीडीएफ चुनें।" 
                      : "Select a module PDF on the right to preview it here."}
                  </span>
                </div>
              )}
            </div>
          </aside>

          <div className="kb-pr-detail-sidebar-col">
            <div className="kb-pr-detail-rail-head">
              <h1>{isHi ? "परियोजना रिपोर्ट" : "Project report"}</h1>
              <p className="kb-pr-detail-district-line">{isHi ? "जिला: " : "District: "}{mainGroupName}</p>
              <p className="kb-pr-detail-section-sub">{isHi ? "मॉड्यूल सामग्री" : "Module content"}</p>
            </div>
            
            <div className="kb-pr-detail-module-list">
              {reportGroups.map((group, groupIdx) => {
                const groupName = isHi && group.hindi_name ? group.hindi_name : group.name;
                return (
                  <article key={group.id || groupIdx} className="kb-pr-detail-mod-card">
                    <div className="kb-pr-detail-mod-card__top">
                      <span className="kb-pr-detail-mod-card__tag">
                        {isHi ? "मॉड्यूल " : "MODULE "}{groupIdx + 1}
                      </span>
                    </div>
                    <h2 className="kb-pr-detail-mod-card__title">{groupName}</h2>
                    <hr className="kb-pr-detail-mod-card__rule" />
                    
                    {group.projectreport && group.projectreport.length > 0 ? (
                      <div className="kb-pr-detail-mod-card__pdf-list">
                        {group.projectreport.map((report) => {
                          if (!report.file) return null;
                          const fileUrl = report.file;
                          const reportTitle = isHi && report.hindi_title ? report.hindi_title : report.title;
                          const label = isHi ? `${reportTitle} — दस्तावेज़ (पीडीएफ)` : `${reportTitle} — Document (PDF)`;
                          const previewLabel = `${groupName} — ${label}`;
                          const isCurrentActive = activePdfUrl === `${API_CONFIG.IMAGE_BASE_URL}${fileUrl}`;
                          
                          return (
                            <button 
                              key={report.id}
                              type="button" 
                              className={`kb-pr-detail-mod-card__pdf ${isCurrentActive ? 'is-active' : ''}`}
                              onClick={() => handlePdfClick(fileUrl, previewLabel)}
                            >
                              <span>{label}</span>
                              <i className="fas fa-file-pdf" aria-hidden="true"></i>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <button type="button" className="kb-pr-detail-mod-card__pdf" disabled>
                        <span>{isHi ? "पीडीएफ अभी लिंक नहीं किया गया है" : "PDF not linked yet"}</span>
                        <i className="fas fa-file-pdf" aria-hidden="true"></i>
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
