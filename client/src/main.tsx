import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import PublicApp from "./PublicApp";
import "./index.css";

const AuthenticatedBootstrap = lazy(() => import("./AuthenticatedBootstrap"));
const publicPaths = new Set(["/", "/termos", "/privacidade"]);
const isPublicRoute = publicPaths.has(window.location.pathname);

createRoot(document.getElementById("root")!).render(
  isPublicRoute ? (
    <PublicApp />
  ) : (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ec] dark:bg-[#091725]" />}>
      <AuthenticatedBootstrap />
    </Suspense>
  )
);
