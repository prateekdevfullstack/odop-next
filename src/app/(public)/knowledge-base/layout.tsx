export default function KnowledgeBaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="knowledge-hub-pages">{children}</div>;
}
