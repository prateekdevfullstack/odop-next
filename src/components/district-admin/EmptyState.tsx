import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="district-admin-empty panel">
      <h3>{title}</h3>
      {description ? <p className="panel-meta">{description}</p> : null}
      {actionLabel && actionHref ? (
        <Link href={actionHref} className="btn" style={{ marginTop: 16, display: "inline-block" }}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
