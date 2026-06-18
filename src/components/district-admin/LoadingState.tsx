export default function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="district-admin-loading">
      <div className="district-admin-loading__spinner" aria-hidden />
      <p>{label}</p>
    </div>
  );
}
