"use client";

import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function AppProviders({ children }) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
        <ToastProvider />
      </AuthProvider>
    </QueryProvider>
  );
}
