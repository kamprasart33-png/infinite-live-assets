import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import TrackDetail from "./pages/TrackDetail";
import Success from "./pages/Success";

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
      <Route path="/store">
        <Store />
      </Route>
      <Route path="/store/track/:id">
        {(params) => <TrackDetail trackId={Number(params.id)} />}
      </Route>
      <Route path="/success">
        <Success />
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
