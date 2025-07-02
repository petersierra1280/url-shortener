import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you were looking for doesn't exist.</p>
      <Link href="/dashboard">
        <button style={{ marginTop: "1rem" }}>Go back to Dashboard</button>
      </Link>
    </div>
  );
}
