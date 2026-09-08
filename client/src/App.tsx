import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Admin from "./pages/Admin";
import Achievements from "./pages/Achievements";
import Devotional from "./pages/Devotional";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Journey from "./pages/Journey";
import Profile from "./pages/Profile";

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/devocional/:dayNumber" component={Devotional} /><Route path="/jornada" component={Journey} /><Route path="/diario" component={Journal} /><Route path="/favoritos" component={Favorites} /><Route path="/conquistas" component={Achievements} /><Route path="/perfil" component={Profile} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
export default App;
