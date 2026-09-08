import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { lazy, Suspense } from "react";
import Landing from "./pages/Landing";

const Legal = lazy(() => import("./pages/Legal"));

export default function PublicApp() {
  const isLanding = window.location.pathname === "/";

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        {isLanding ? (
          <Landing />
        ) : (
          <Suspense fallback={<div className="min-h-screen bg-[#f7f4ec] dark:bg-[#091725]" />}>
            <Legal />
          </Suspense>
        )}
      </ThemeProvider>
    </ErrorBoundary>
  );
}
