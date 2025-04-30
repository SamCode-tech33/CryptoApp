"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <img
      src={theme === "dark" ? "/Images/zen-white.jpg" : "/Images/zen-black.jpg"}
      alt="ZenCoin Logo"
      className={theme === "dark" ? "h-8 mr-1" : "h-6 mr-1"}
    />
  );
}
