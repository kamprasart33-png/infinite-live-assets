import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
  const [, navigate] = useLocation();
  return (
    <Switch>
      <Route path="/">
        <Landing onSignIn={() => navigate("/dashboard")} />
      </Route>
      <Route path="/dashboard">
        <Dashboard onSignOut={() => navigate("/")} />
      </Route>
    </Switch>
  );
}

export default function App() {
  const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
  return (
    <WouterRouter base={base}>
      <AppRoutes />
    </WouterRouter>
  );
}
