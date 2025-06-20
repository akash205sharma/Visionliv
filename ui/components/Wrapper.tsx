"use client";

import { ReactNode } from "react";
import { SessionProvider } from "@/context/SessionContext";

export default function Wrapper({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

