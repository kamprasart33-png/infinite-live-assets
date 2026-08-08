import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import TrackDetail from "./pages/TrackDetail";
import Success from "./pages/Success";

const AUTH_KEY = "ia_session";

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === "1";
}

function setAuthenticated(value: boolean) {
  if (value) {
    localStorage.setItem(AUTH_KEY, "1");
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const [, navigate] = useLocation();

  const handleSignIn = () => {
    setAuthenticated(true);
    navigate("/dashboard");
  };

  const handleSignOut = () => {
    setAuthenticated(false);
    navigate("/");
  };

  return (
    <Switch>
      <Route path="/">
        <Landing onSignIn={handleSignIn} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard onSignOut={handleSignOut} />
        </ProtectedRoute>
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
