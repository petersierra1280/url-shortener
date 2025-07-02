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
import Layout from "../components/Layout";
import ShortenUrlForm from "../components/ShortenUrlForm";
import PaginationControls from "../components/PaginationControls";

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();

  const pageParam = parseInt((router.query.page as string) || "1", 10);

  const [loading, setLoading] = useState(true);
  const [limit] = useState(10);
  const [offset, setOffset] = useState((pageParam - 1) * limit);
  const [total, setTotal] = useState(0);

  const [urls, setUrls] = useState<UrlItem[]>([]);
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

  const handleSubmitUrl = async (originalUrl: string, slug?: string) => {
    setError("");
    try {
      const newUrl = await createUrl(token!, { originalUrl, slug });
      setUrls([newUrl, ...urls]);
    } catch {
      setError(
        "Failed to shorten URL. Maybe the slug is taken or the URL is invalid."
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
    <Layout>
      <ShortenUrlForm
        onSubmit={(url, customSlug) => handleSubmitUrl(url, customSlug)}
        error={error}
      />

      <h2>Your URLs</h2>
      {loading && <p>Loading your URLs...</p>}
      {!loading && urls.length === 0 && !error && (
        <p>You haven’t created any short URLs yet.</p>
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
      {!loading && total > limit && (
        <PaginationControls
          total={total}
          limit={limit}
          offset={offset}
          onPageChange={(newOffset) => setOffset(newOffset)}
        />
      )}
    </Layout>
  );
}
