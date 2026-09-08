import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Loader2 } from "lucide-react";

const Admin = lazy(() => import("./pages/Admin"));
const Devotional = lazy(() => import("./pages/Devotional"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Home = lazy(() => import("./pages/Home"));
const Journal = lazy(() => import("./pages/Journal"));
const Journey = lazy(() => import("./pages/Journey"));
const Login = lazy(() => import("./pages/Login"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));

function RouteLoader() { return <div className="flex min-h-screen items-center justify-center bg-[#f7f4ec] text-[#b9944a] dark:bg-[#091725]"><Loader2 className="h-6 w-6 animate-spin" aria-label="Carregando página" /></div>; }
function Router() { return <Suspense fallback={<RouteLoader />}><Switch><Route path="/login" component={Login} /><Route path="/dashboard" component={Home} /><Route path="/devocional/:dayNumber" component={Devotional} /><Route path="/jornada" component={Journey} /><Route path="/diario" component={Journal} /><Route path="/favoritos" component={Favorites} /><Route path="/perfil" component={Profile} /><Route path="/admin" component={Admin} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch></Suspense>; }
function App() { return <ErrorBoundary><ThemeProvider defaultTheme="light" switchable><TooltipProvider><Toaster richColors position="top-right" /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>; }
export default App;
