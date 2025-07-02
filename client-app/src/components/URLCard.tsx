import { useEffect, useState } from "react";
import { UrlItem, fetchUrlStats, UrlStats } from "../services/url.service";

interface Props {
  url: UrlItem;
  token: string;
  onCopy: (shortUrl: string) => void;
  onUpdate: (
    oldSlug: string,
    newSlug: string,
    onError: (msg: string) => void
  ) => void;
  onDelete: (slug: string) => void;
}

export default function URLCard({
  url,
  token,
  onCopy,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false);
  const [newSlug, setNewSlug] = useState(url.slug);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<UrlStats | null>(null);

  useEffect(() => {
    fetchUrlStats(token, url.slug)
      .then(setStats)
      .catch(() => setStats(null));
  }, [token, url.slug]);

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
      {stats ? (
        <>
          <p>
            <strong>Visits:</strong> {stats.visitCount}
          </p>
          <p>
            <strong>Last Visit:</strong>{" "}
            {stats.lastVisit
              ? new Date(stats.lastVisit).toLocaleString()
              : "Never"}
          </p>
        </>
      ) : (
        <p>Loading stats...</p>
      )}
      <button onClick={() => onCopy(shortUrl)}>Copy</button>
      <button onClick={() => confirm("Delete this URL?") && onDelete(url.slug)}>
        Delete
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
