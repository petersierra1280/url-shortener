import api from "../lib/api";

export type UrlItem = {
  id: string;
  slug: string;
  originalUrl: string;
  visitCount: number;
  createdAt: string;
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

export async function fetchUserUrls(token: string): Promise<UrlItem[]> {
  const res = await api.get("/user/urls", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.data;
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
