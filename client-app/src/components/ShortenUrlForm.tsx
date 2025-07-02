import { useState } from "react";
import { Stack, TextField, Button, Typography } from "@mui/material";

interface Props {
  onSubmit: (originalUrl: string, slug?: string) => void;
  error?: string;
}

export default function ShortenUrlForm({ onSubmit, error }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(originalUrl, slug || undefined);
    setOriginalUrl("");
    setSlug("");
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
        <Button type="submit" variant="contained">
          Shorten
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </Stack>
    </form>
  );
}
