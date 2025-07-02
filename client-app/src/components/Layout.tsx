import Header from "./Header";
import { Container } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>{children}</Container>
    </>
  );
}
