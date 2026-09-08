import { getProtectedRedirect } from "@/auth-routing";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });
  const redirect = getProtectedRedirect({ loading, authenticated: Boolean(user) });

  if (redirect || loading) return <div className="flex min-h-screen items-center justify-center bg-[#f7f8fb] text-[#b38c31]"><Loader2 className="h-7 w-7 animate-spin" aria-label="Verificando acesso" /></div>;
  return <>{children}</>;
}
