"use client";

import Link from "next/link";
import Image from "next/image";
import { API_CONFIG } from "@/lib/api";
import { BLUR_DATA_URL } from "@/lib/image-placeholders";

type DetailField = { label: string; value: string | number | null | undefined };

type EntityDetailViewProps = {
  title: string;
  subtitle: string;
  logoUrl?: string | null;
  fields: DetailField[];
  editHref: string;
  backHref: string;
};

function resolveAssetUrl(path?: string | null): string | null {
  if (!path?.trim()) return null;
  const p = path.trim();
  if (p.startsWith("http://") || p.startsWith("https://")) return p;
  const base = API_CONFIG.NEW_BASE_URL.replace(/\/$/, "");
  return `${base}/${p.replace(/^\//, "")}`;
}

export default function EntityDetailView({
  title,
  subtitle,
  logoUrl,
  fields,
  editHref,
  backHref,
}: EntityDetailViewProps) {
  const resolvedLogo = resolveAssetUrl(logoUrl);

  return (
    <div className="dashboard-content">
      <header className="page-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>

      <div className="panel">
        <div className="panel-head">
          <div />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Link href={backHref} className="btn-outline">
              Back to list
            </Link>
            <Link href={editHref} className="btn">
              Edit
            </Link>
          </div>
        </div>

        {resolvedLogo ? (
          <Image
            src={resolvedLogo}
            alt=""
            width={120}
            height={120}
            sizes="120px"
            quality={80}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL.light}
            style={{ maxWidth: 120, borderRadius: 12, marginBottom: 20, height: "auto" }}
          />
        ) : null}

        <dl
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            margin: 0,
          }}
        >
          {fields.map((field) => (
            <div key={field.label}>
              <dt style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 4 }}>
                {field.label}
              </dt>
              <dd style={{ margin: 0, fontWeight: 600 }}>{field.value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
