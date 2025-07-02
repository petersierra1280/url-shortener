import { useState } from "react";
import { Stack, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { isValidUrl, isValidSlug } from "../lib/utils.validations";

interface Props {
  onSubmit: (originalUrl: string, slug?: string) => void;
  error?: string;
}

export default function ShortenUrlForm({ onSubmit, error }: Props) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const displayError = formError || error;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setFormError("");

    if (!isValidUrl(originalUrl)) {
      setFormError("Please enter a valid URL.");
      return;
    }

    if (slug && !isValidSlug(slug)) {
      setFormError("Slug must contain only letters, numbers, - or _.");
      return;
    }

    setLoading(true);

    try {
      onSubmit(originalUrl, slug || undefined);
      setOriginalUrl("");
      setSlug("");
    } catch {
      setFormError("There was an error trying to shorten URL.");
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
        {displayError && <Typography color="error">{displayError}</Typography>}
      </Stack>
    </form>
  );
}
