import { useEffect, useState } from "react";

interface Props {
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        backgroundColor: "#333",
        color: "#fff",
        padding: "1rem 1.5rem",
        borderRadius: "4px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        zIndex: 9999,
      }}
    >
      {message}
    </div>
  );
}
