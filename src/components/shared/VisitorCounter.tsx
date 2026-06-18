"use client";

import { useEffect, useState } from "react";
import { httpClient } from "@/lib/api/http-client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useLanguage } from "@/hooks/useLanguage";
import styles from "@/styles/Footer.module.css";

interface VisitorResponse {
  count: number;
}

export default function VisitorCounter() {
  const lang = useLanguage();
  const [count, setCount] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasVisited = sessionStorage.getItem("has_visited_session");

    const fetchCount = async () => {
      try {
        if (!hasVisited) {
          const res = await httpClient.post<VisitorResponse>(ENDPOINTS.visitors.increment);
          if (res.success && res.data) {
            setCount(res.data.count);
            sessionStorage.setItem("has_visited_session", "true");
            setVisible(true);
          }
        } else {
          const res = await httpClient.get<VisitorResponse>(ENDPOINTS.visitors.get);
          if (res.success && res.data) {
            setCount(res.data.count);
            setVisible(true);
          }
        }
      } catch (err) {
      }
    };

    fetchCount();
  }, []);

  if (count === null) {
    return null;
  }

  const digits = String(count).padStart(6, "0").split("");
  const title = lang === "hi" ? "विज़िटर काउंटर" : "Visitor Counter";

  return (
    <div className={`${styles.visitorCounterSection} ${visible ? styles.loaded : ""}`} style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}>
      <h4 className={styles.colTitle}>{title}</h4>
      <div className={styles.titleLine}></div>
      <div className={styles.counterGrid}>
        {digits.map((digit, index) => (
          <span key={index}>{digit}</span>
        ))}
      </div>
    </div>
  );
}
