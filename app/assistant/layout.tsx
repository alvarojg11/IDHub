"use client";

import { useEffect } from "react";

export default function AssistantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.body.classList.add("idhub-assistant-route");

    return () => {
      document.body.classList.remove("idhub-assistant-route");
    };
  }, []);

  return children;
}
