import Link from "next/link";

export default function EntryPage() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to URL Shortener</h1>
      <p>Please login or create a new account to get started.</p>

      <div style={{ marginTop: "1.5rem" }}>
        <Link href="/login">
          <button style={{ marginRight: "1rem" }}>Login</button>
        </Link>
        <Link href="/register">
          <button>Create Account</button>
        </Link>
      </div>
    </div>
  );
}
