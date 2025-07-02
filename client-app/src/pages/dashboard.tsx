import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  createUrl,
  fetchUserUrls,
  UrlItem,
  updateSlug,
  deleteUrl,
} from "../services/url.service";
import { useRouter } from "next/router";
import URLCard from "../components/URLCard";
import PaginationControls from "../components/PaginationControls";

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);

  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [originalUrl, setOriginalUrl] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setLoading(true);
      fetchUserUrls(token, limit, offset)
        .then((res) => {
          setUrls(res.data);
          setTotal(res.total);
          setError("");
        })
        .catch(() => setError("Failed to load URLs"))
        .finally(() => setLoading(false));
    }
  }, [token, offset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const newUrl = await createUrl(token!, {
        originalUrl,
        slug: slug || undefined,
      });
      setUrls([newUrl, ...urls]);
      setOriginalUrl("");
      setSlug("");
    } catch (err) {
      setError(
        "Failed to shorten URL. Maybe the slug is taken or URL is invalid."
      );
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    alert(`Copied to clipboard: ${shortUrl}`);
  };

  const handleUpdateSlug = async (
    oldSlug: string,
    newSlug: string,
    onError: (msg: string) => void
  ) => {
    try {
      const updated = await updateSlug(token!, oldSlug, newSlug);
      setUrls(urls.map((u) => (u.slug === oldSlug ? updated : u)));
    } catch (err) {
      onError("Slug update failed — it may already be taken or invalid.");
    }
  };

  const handleDelete = async (slug: string) => {
    try {
      await deleteUrl(token!, slug);
      setUrls(urls.filter((u) => u.slug !== slug));
    } catch (err) {
      setError("Failed to delete URL.");
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Logout</button>

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
      </form>

      {error && <p>{error}</p>}

      <h2>Your URLs</h2>

      {loading && <p>Loading your URLs...</p>}

      {urls.length === 0 && !error && (
        <p style={{ color: "#666", fontStyle: "italic", marginTop: "1rem" }}>
          You haven&apos;t created any short URLs yet.
        </p>
      )}

      {urls.map((url) => (
        <URLCard
          key={url.id}
          url={url}
          token={token!}
          onCopy={handleCopy}
          onUpdate={(old, next, onError) =>
            handleUpdateSlug(old, next, onError)
          }
          onDelete={handleDelete}
        />
      ))}

      {total > limit && (
        <PaginationControls
          total={total}
          limit={limit}
          offset={offset}
          onPageChange={(newOffset) => setOffset(newOffset)}
        />
      )}
    </div>
  );
}
