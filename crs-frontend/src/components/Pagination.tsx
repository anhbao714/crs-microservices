interface PaginationProps {
  currentPage: number; // bat dau tu 0, dung dinh dang giong Spring Data Pageable
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SIBLINGS = 1;

function buildPageItems(currentPage: number, totalPages: number): (number | 'ellipsis')[] {
  const items: (number | 'ellipsis')[] = [];
  const start = Math.max(1, currentPage - SIBLINGS);
  const end = Math.min(totalPages - 2, currentPage + SIBLINGS);

  items.push(0);
  if (start > 1) items.push('ellipsis');
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 2) items.push('ellipsis');
  if (totalPages > 1) items.push(totalPages - 1);

  return items;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const items = buildPageItems(currentPage, totalPages);

  return (
    <div className="pagination">
      <button
        type="button"
        className="pagination__nav"
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &laquo; Trang truoc
      </button>

      <div className="pagination__pages">
        {items.map((item, idx) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${idx}`} className="pagination__ellipsis">
              &hellip;
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`pagination__page${item === currentPage ? ' pagination__page--active' : ''}`}
              onClick={() => onPageChange(item)}
            >
              {item + 1}
            </button>
          ),
        )}
      </div>

      <button
        type="button"
        className="pagination__nav"
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Trang sau &raquo;
      </button>
    </div>
  );
}
