import {
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState, useEffect } from "react";
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
  const [stats, setStats] = useState<UrlStats | null>(null);
  const [editing, setEditing] = useState(false);
  const [newSlug, setNewSlug] = useState(url.slug);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    fetchUrlStats(token, url.slug)
      .then(setStats)
      .catch(() => setStats(null));
  }, [url.slug, token]);

  const handleSave = () => {
    setLoadingSave(true);
    try {
      if (newSlug && newSlug !== url.slug) {
        onUpdate(url.slug, newSlug, () => {});
      }
      setEditing(false);
    } finally {
      setLoadingSave(false);
    }
  };

  const shortUrl = `${window.location.origin}/r/${url.slug}`;

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2">Original:</Typography>
          <Typography variant="body2">{url.originalUrl}</Typography>

          <Typography variant="subtitle2">Slug:</Typography>
          {editing ? (
            <Stack direction="row" spacing={1}>
              <TextField
                size="small"
                value={newSlug}
                onChange={(e) => setNewSlug(e.target.value)}
              />
              <LoadingButton onClick={handleSave} loading={loadingSave}>
                Save
              </LoadingButton>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography>{url.slug}</Typography>
              <Button size="small" onClick={() => setEditing(true)}>
                Edit
              </Button>
            </Stack>
          )}

          {stats && (
            <>
              <Typography variant="subtitle2">Visits:</Typography>
              <Typography variant="body2">{stats.visitCount}</Typography>
              <Typography variant="body2">
                Last Visit:{" "}
                {stats.lastVisit
                  ? new Date(stats.lastVisit).toLocaleString()
                  : "Never"}
              </Typography>
            </>
          )}

          <Stack direction="row" spacing={2} mt={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => onCopy(shortUrl)}
            >
              Copy
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => confirm("Delete this URL?") && onDelete(url.slug)}
            >
              Delete
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
