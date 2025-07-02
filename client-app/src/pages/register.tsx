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

export default function RegisterPage() {
  const { register } = useAuth();
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
      await register({ email, password });
      router.push("/dashboard");
    } catch {
      setError("Registration failed. Email may already be in use.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Create Account
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
            Register
          </LoadingButton>
        </Stack>
      </form>
    </Container>
  );
}
