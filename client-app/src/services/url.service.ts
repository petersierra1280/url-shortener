import api from "../lib/api";

export type UrlItem = {
  id: string;
  slug: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
};

export type UrlStats = UrlItem & {
  lastVisit: string | null;
};

export async function createUrl(
  token: string,
  payload: { originalUrl: string; slug?: string }
) {
  const res = await api.post("/url", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function fetchUserUrls(
  token: string,
  limit: number,
  offset: number
): Promise<{ total: number; limit: number; offset: number; data: UrlItem[] }> {
  const res = await api.get("/user/urls", {
    headers: { Authorization: `Bearer ${token}` },
    params: { limit, offset },
  });
  return res.data;
}

export async function updateSlug(
  token: string,
  oldSlug: string,
  newSlug: string
): Promise<UrlItem> {
  const res = await api.patch(
    `/url/${oldSlug}`,
    { newSlug },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function deleteUrl(token: string, slug: string): Promise<void> {
  await api.delete(`/url/${slug}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchUrlStats(
  token: string,
  slug: string
): Promise<UrlStats> {
  const res = await api.get(`/url/${slug}/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
