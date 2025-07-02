import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { login as authLogin } from "../services/auth.service";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authLogin(email, password);
      login(res.token);
      router.push("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <LoadingButton type="submit" variant="contained" loading={loading}>
            Login
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
}
