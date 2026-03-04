import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

const getPaginationItems = (currentPage: number, totalPages: number, siblingCount: number) => {
  const totalPageNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalPageNumbers) {
    return range(1, totalPages);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSiblingIndex > 2;
  const showRightDots = rightSiblingIndex < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    return [...range(1, leftItemCount), '...', totalPages];
  }

  if (showLeftDots && !showRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    return [1, '...', ...range(totalPages - rightItemCount + 1, totalPages)];
  }

  return [1, '...', ...range(leftSiblingIndex, rightSiblingIndex), '...', totalPages];
};

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const pages = getPaginationItems(currentPage, totalPages, siblingCount);

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-200 bg-white px-6 py-4 shadow-sm">
      <p className="text-sm text-brand-600 hidden sm:block">
        Strona{' '}
        <span className="font-semibold text-brand-800">{currentPage}</span>
        {' '}z{' '}
        <span className="font-semibold text-brand-800">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1 mx-auto sm:mx-0">
        <button
          onClick={() => goTo(1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Pierwsza strona"
        >
          <ChevronsLeft size={16} />
        </button>

        <button
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Poprzednia strona"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1">
          {pages.map((page, idx) =>
            page === '...' ? (
              <span
                key={`dots-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-brand-400 select-none"
              >
                …
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goTo(page as number)}
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition ${
                  currentPage === page
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100'
                }`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Następna strona"
        >
          <ChevronRight size={16} />
        </button>

        <button
          onClick={() => goTo(totalPages)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Ostatnia strona"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      <p className="text-sm text-brand-600 sm:hidden">
        <span className="font-semibold text-brand-800">{currentPage}</span>
        {' / '}
        <span className="font-semibold text-brand-800">{totalPages}</span>
      </p>
    </div>
  );
};

export default Pagination;
