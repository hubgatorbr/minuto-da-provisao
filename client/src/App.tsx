import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Admin from "@/pages/Admin";
import Devotional from "@/pages/Devotional";
import Favorites from "@/pages/Favorites";
import Home from "@/pages/Home";
import Journal from "@/pages/Journal";
import Journey from "@/pages/Journey";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/jornada" component={Journey} />
    <Route path="/devocional/:dayNumber" component={Devotional} />
    <Route path="/diario" component={Journal} />
    <Route path="/favoritos" component={Favorites} />
    <Route path="/perfil" component={Profile} />
    <Route path="/admin" component={Admin} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
