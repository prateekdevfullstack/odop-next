type CategorySelectionPromptProps = {
  title: string;
  entityLabel: string;
};

export default function CategorySelectionPrompt({
  title,
  entityLabel,
}: CategorySelectionPromptProps) {
  return (
    <div className="dashboard-content">
      <div className="panel district-admin-empty">
        <h1>{title}</h1>
        <p>
          Select a product category from the sidebar, then choose {entityLabel} to manage records
          for that category.
        </p>
      </div>
    </div>
  );
}
