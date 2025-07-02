import { useState } from "react";

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
      <input
        placeholder="Original URL"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />
      <input
        placeholder="Custom Slug (optional)"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
      />
      <button type="submit">Shorten</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
