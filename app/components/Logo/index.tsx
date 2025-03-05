"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Logo() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Image
      src={theme === "dark" ? "/Images/zen-white.jpg" : "/Images/zen-black.jpg"}
      alt="ZenCoin Logo"
      className={theme === "dark" ? "h-8" : "h-6"}
    />
  );
}
