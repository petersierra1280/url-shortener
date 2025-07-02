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
import { Typography, Stack, Button } from "@mui/material";

import URLCard from "../components/URLCard";
import Layout from "../components/Layout";
import ShortenUrlForm from "../components/ShortenUrlForm";
import PaginationControls from "../components/PaginationControls";
import Toast from "../components/Toast";

export default function DashboardPage() {
  const { token } = useAuth();
  const router = useRouter();

  const pageParam = parseInt((router.query.page as string) || "1", 10);

  const [loading, setLoading] = useState(true);
  const [limit] = useState(5);
  const [offset, setOffset] = useState((pageParam - 1) * limit);
  const [total, setTotal] = useState(0);

  const [urls, setUrls] = useState<UrlItem[]>([]);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      setLoading(true);
      (async () => {
        try {
          const res = await fetchUserUrls(token, limit, offset);
          setUrls(res.data);
          setTotal(res.total);
          setError("");
        } catch {
          setError("Failed to load URLs");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [token, offset]);

  const handleSubmitUrl = async (originalUrl: string, slug?: string) => {
    setError("");
    try {
      const newUrl = await createUrl(token!, { originalUrl, slug });
      setUrls([newUrl, ...(urls ?? [])]);
      setToastMessage("Short URL created successfully");
    } catch {
      setError(
        "Failed to shorten URL. Check that the slug entered is not already taken."
      );
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    setToastMessage("Short URL copied to clipboard");
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
      setToastMessage("Short URL deleted successfully");
    } catch (err) {
      setError("Failed to delete URL.");
    }
  };

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <ShortenUrlForm
        onSubmit={(url, customSlug) => handleSubmitUrl(url, customSlug)}
        error={error}
      />

      <Typography variant="h6" sx={{ mt: 4 }}>
        Your URLs
      </Typography>

      {loading && <Typography>Loading your URLs...</Typography>}

      {!loading && urls?.length === 0 && !error && (
        <Stack spacing={2} alignItems="center" mt={4}>
          <Typography color="text.secondary">
            You haven't created any short URLs yet.
          </Typography>
          <Button
            variant="contained"
            onClick={() => {
              const formEl = document.querySelector("form");
              formEl?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Create your first URL
          </Button>
        </Stack>
      )}

      {urls?.map((url) => (
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

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </Layout>
  );
}
