import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";
import { Typography } from "@mui/material";
import NotFoundPage from "../404";

export default function RedirectPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug || typeof slug !== "string") return;

    async function resolveRedirect() {
      try {
        const res = await api.get(`/r/${slug}`);
        const url = res.data;
        router.replace(url);
      } catch (err) {
        setError("This link does not exist.");
      }
    }

    resolveRedirect();
  }, [slug]);

  if (error) {
    return <NotFoundPage />;
  }

  return <Typography>Redirecting...</Typography>;
}
