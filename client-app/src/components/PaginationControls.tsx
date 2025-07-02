interface Props {
  total: number;
  limit: number;
  offset: number;
  onPageChange: (newOffset: number) => void;
}

export default function PaginationControls({
  total,
  limit,
  offset,
  onPageChange,
}: Props) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ marginTop: "2rem" }}>
      <button
        disabled={offset === 0}
        onClick={() => onPageChange(Math.max(offset - limit, 0))}
      >
        Previous
      </button>

      <span style={{ margin: "0 1rem" }}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        disabled={offset + limit >= total}
        onClick={() => onPageChange(offset + limit)}
      >
        Next
      </button>
    </div>
  );
}
