import { Button, ButtonGroup, Typography, Stack } from "@mui/material";

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
  const page = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <Stack direction="row" alignItems="center" spacing={2} mt={4}>
      <ButtonGroup>
        <Button
          disabled={offset === 0}
          onClick={() => onPageChange(Math.max(offset - limit, 0))}
        >
          Previous
        </Button>
        <Button
          disabled={offset + limit >= total}
          onClick={() => onPageChange(offset + limit)}
        >
          Next
        </Button>
      </ButtonGroup>
      <Typography variant="body2">
        Page {page} of {totalPages}
      </Typography>
    </Stack>
  );
}
