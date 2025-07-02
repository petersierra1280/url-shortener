import { Button, Typography, Stack, Container } from "@mui/material";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <Container sx={{ mt: 10, textAlign: "center" }}>
      <Stack spacing={2}>
        <Typography variant="h3" color="error">
          404
        </Typography>
        <Typography variant="h6">Page Not Found</Typography>
        <Typography>
          Sorry, the page you were looking for doesn't exist.
        </Typography>
        <Link href="/" passHref>
          <Button variant="outlined">Back to Home</Button>
        </Link>
      </Stack>
    </Container>
  );
}
