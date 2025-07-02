import { useState } from "react";
import { UrlItem } from "../services/url.service";

interface Props {
  url: UrlItem;
  onCopy: (shortUrl: string) => void;
  onUpdate: (
    oldSlug: string,
    newSlug: string,
    onError: (msg: string) => void
  ) => void;
}

export default function URLCard({ url, onCopy, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [newSlug, setNewSlug] = useState(url.slug);
  const [error, setError] = useState("");

  const shortUrl = `${window.location.origin}/r/${url.slug}`;

  const handleSave = () => {
    if (!newSlug || newSlug === url.slug) {
      setEditing(false);
      return;
    }
    onUpdate(url.slug, newSlug, (msg) => {
      setError(msg);
    });
    setEditing(false);
  };

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "1rem",
        marginBottom: "1rem",
      }}
    >
      <p>
        <strong>Slug:</strong>{" "}
        {editing ? (
          <>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
            />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <>
            {url.slug} <button onClick={() => setEditing(true)}>Edit</button>
          </>
        )}
      </p>
      <p>
        <strong>Original:</strong> {url.originalUrl}
      </p>
      <p>
        <strong>Visits:</strong> {url.visitCount}
      </p>
      <button onClick={() => onCopy(shortUrl)}>Copy</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
