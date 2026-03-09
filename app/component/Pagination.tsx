"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  perPage: number;
  onPageChange?: (page: number) => void;
  /** Si true, usa query params (?page=N) en la URL en lugar de callback */
  useUrl?: boolean;
}

export default function Pagination({
  page,
  totalPages,
  total,
  perPage,
  onPageChange,
  useUrl = true,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const handlePage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
    } else if (useUrl) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      if (perPage !== 20) params.set("perPage", String(perPage));
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  const pages: (number | "...")[] = [];
  const showEllipsisStart = page > 3;
  const showEllipsisEnd = page < totalPages - 2;

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (showEllipsisStart) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (showEllipsisEnd) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6">
      <p className="text-gray-600 text-sm">
        Mostrando {start}-{end} de {total} productos
      </p>
      <nav aria-label="Paginación" className="flex items-center gap-1">
        <button
          onClick={() => handlePage(page - 1)}
          disabled={page <= 1}
          className="flex justify-center items-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          aria-label="Página anterior"
        >
          <FiChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-1 mx-1">
          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => handlePage(p)}
                className={`min-w-[2.5rem] h-10 px-3 rounded-lg font-medium transition-colors ${
                  page === p
                    ? "bg-[#373577] text-white"
                    : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>
        <button
          onClick={() => handlePage(page + 1)}
          disabled={page >= totalPages}
          className="flex justify-center items-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700"
          aria-label="Página siguiente"
        >
          <FiChevronRight size={20} />
        </button>
      </nav>
    </div>
  );
}
