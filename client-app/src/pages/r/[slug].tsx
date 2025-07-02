import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import api from "../../lib/api";

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
    return (
      <div>
        <h1>404 Not Found</h1>
        <p>{error}</p>
      </div>
    );
  }

  return <p>Redirecting...</p>;
}
