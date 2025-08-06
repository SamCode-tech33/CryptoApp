"use client";

import { useEffect } from "react";

export function useHeadTags() {
  useEffect(() => {
    // Set title
    document.title = "ZenCoin";

    // Set favicon
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }
    link.setAttribute("href", "/zen-fav.png");
  }, []);
}
