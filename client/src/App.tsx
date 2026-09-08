import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import Achievements from "./pages/Achievements";
import AppHome from "./pages/AppHome";
import Devotional from "./pages/Devotional";
import Favorites from "./pages/Favorites";
import Journal from "./pages/Journal";
import Journey from "./pages/Journey";
import LandingPage from "./pages/LandingPage";
import Legal from "./pages/Legal";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import type { ComponentType } from "react";

function AuthenticatedPage({ page: Page }: { page: ComponentType }) {
  return <ProtectedRoute><Page /></ProtectedRoute>;
}

function Router() {
  return <Switch>
    <Route path="/" component={LandingPage} />
    <Route path="/manus-api" component={LandingPage} />
    <Route path="/login" component={Login} />
    <Route path="/termos" component={Legal} />
    <Route path="/privacidade" component={Legal} />
    <Route path="/app" component={() => <AuthenticatedPage page={AppHome} />} />
    <Route path="/devocional/:dayNumber" component={() => <AuthenticatedPage page={Devotional} />} />
    <Route path="/jornada" component={() => <AuthenticatedPage page={Journey} />} />
    <Route path="/diario" component={() => <AuthenticatedPage page={Journal} />} />
    <Route path="/favoritos" component={() => <AuthenticatedPage page={Favorites} />} />
    <Route path="/conquistas" component={() => <AuthenticatedPage page={Achievements} />} />
    <Route path="/perfil" component={() => <AuthenticatedPage page={Profile} />} />
    <Route path="/admin" component={() => <AuthenticatedPage page={Admin} />} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
