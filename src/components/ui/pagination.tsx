"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  function pageUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  }

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="flex items-center gap-1">
      {currentPage > 1 && (
        <Link
          href={pageUrl(currentPage - 1)}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <Link
            key={page}
            href={pageUrl(page)}
            className={cn(
              "px-2.5 py-1 rounded text-sm",
              page === currentPage
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200 text-gray-600"
            )}
          >
            {page}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={pageUrl(currentPage + 1)}
          className="p-1.5 rounded hover:bg-gray-200 text-gray-600"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
