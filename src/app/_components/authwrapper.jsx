"use client";

import { AuthProvider } from "./authprovider";

export default function AuthWrapper({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}

