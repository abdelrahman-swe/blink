import { Dispatch, SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface CategoryPaginationProps {
  currentPage: number;
  hasMore?: boolean;
  onPageChange: (page: number) => void;
  totalPages?: number;
  productCount?: number;
  limit?: number;
  className?: string;
}

export default function CategoryPagination({
  currentPage,
  hasMore,
  onPageChange,
  totalPages: apiTotalPages,
  productCount = 0,
  limit = 1,
  className = "mt-8",
}: CategoryPaginationProps) {
  let calculatedTotalPages = 1;

  if (apiTotalPages && apiTotalPages > 0) {
    calculatedTotalPages = apiTotalPages;
  } else if (productCount > 0 && limit > 0) {
    calculatedTotalPages = Math.ceil(productCount / limit);
  }

  if (calculatedTotalPages <= 1) return null;

  const handlePageClick = (page: number) => {
    if (page < 1 || page > calculatedTotalPages) return;
    onPageChange(page);
  };

  const handlePreviousClick = () => {
    if (currentPage <= 1) return;
    const newPage = currentPage - 1;
    onPageChange(newPage);
  };

  const handleNextClick = () => {
    if (currentPage >= calculatedTotalPages) return;
    const newPage = currentPage + 1;
    onPageChange(newPage);
  };

  const generatePages = (): (number | "ellipsis")[] => {
    const pages: (number | "ellipsis")[] = [];

    if (calculatedTotalPages <= 7) {
      for (let i = 1; i <= calculatedTotalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1, 2, 3, "ellipsis");

    if (currentPage > 3 && currentPage < calculatedTotalPages - 2) pages.push(currentPage);

    pages.push("ellipsis", calculatedTotalPages - 2, calculatedTotalPages - 1, calculatedTotalPages);

    return pages;
  };

  return (
    <Pagination className={className} role="navigation" aria-label="Category Pagination">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePreviousClick}
            aria-label="Previous page"
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer rounded-xl transition-colors"
            }
          />
        </PaginationItem>

        {generatePages().map((item, index) =>
          item === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis aria-hidden="true" />
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationLink
                onClick={() => handlePageClick(item)}
                isActive={currentPage === item}
                aria-current={currentPage === item ? "page" : undefined}
                className={`
                  cursor-pointer rounded-md w-9 h-9 flex items-center justify-center transition-all font-medium text-md
                  ${currentPage === item ? "" : "hover:bg-gray-100"}
                `}
                aria-label={`Page ${item}`}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={handleNextClick}
            aria-label="Next page"
            aria-disabled={currentPage >= calculatedTotalPages}
            className={
              currentPage >= calculatedTotalPages
                ? "pointer-events-none opacity-50  "
                : "cursor-pointer rounded-xl transition-colors "
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
