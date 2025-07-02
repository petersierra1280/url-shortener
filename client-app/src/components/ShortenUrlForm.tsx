import { useState } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";

interface Props {
  onSubmit: (originalUrl: string, slug?: string) => void;
  error?: string;
}

export default function ShortenUrlForm({ onSubmit, error }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      onSubmit(originalUrl, slug || undefined);
      setOriginalUrl("");
      setSlug("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          fullWidth
        />
        <TextField
          label="Custom Slug (optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          fullWidth
        />
        <LoadingButton type="submit" variant="contained" loading={loading}>
          Shorten
        </LoadingButton>
        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </form>
  );
}
