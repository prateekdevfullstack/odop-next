import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: any;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Handle searchParams if they are passed
    if (searchParams) {
      // searchParams is usually a promise or a plain object in Next.js 15+
      // In Server Components, it might be a plain object if already awaited
      Object.entries(searchParams).forEach(([key, value]) => {
        if (key !== "page" && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else if (typeof value === 'string') {
            params.set(key, value);
          }
        }
      });
    }
    
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={createPageUrl(i)}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          {i}
        </Link>
      );
    }
    return pages;
  };

  return (
    <div className="pagination">
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
        className={`page-item ${currentPage <= 1 ? "disabled" : ""}`}
        aria-disabled={currentPage <= 1}
      >
        <i className="fas fa-chevron-left"></i>
      </Link>

      {renderPageNumbers()}

      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
        className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}
        aria-disabled={currentPage >= totalPages}
      >
        <i className="fas fa-chevron-right"></i>
      </Link>
    </div>
  );
}
