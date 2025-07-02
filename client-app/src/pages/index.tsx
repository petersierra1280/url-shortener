import { Button, Container, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user]);

  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Welcome to the URL Shortener app
      </Typography>
      <Typography variant="body1">
        Please login or create an account to continue.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Link href="/login" passHref>
          <Button variant="contained">Login</Button>
        </Link>
        <Link href="/register" passHref>
          <Button variant="outlined">Create Account</Button>
        </Link>
      </Stack>
    </Container>
  );
}
