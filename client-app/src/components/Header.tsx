import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <strong>URL Shortener</strong>
      </div>
      <div>
        {user && (
          <>
            <span style={{ marginRight: "1rem" }}>Welcome, {user.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
