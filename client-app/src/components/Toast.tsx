import { Snackbar } from "@mui/material";

interface Props {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: Props) {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={duration}
      onClose={onClose}
      message={message}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    />
  );
}
