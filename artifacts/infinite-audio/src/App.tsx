import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Store from "./pages/Store";
import TrackDetail from "./pages/TrackDetail";
import Success from "./pages/Success";

function ProtectedRoute({ children, isAuthenticated, isLoading }: {
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "100vh", background: "#000", color: "#fff",
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid rgba(6,182,212,0.3)",
            borderTopColor: "var(--cyan-400, #22d3ee)",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 1rem"
          }} />
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Loading…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Redirect to="/" />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleSignIn = () => {
    login();
  };

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <Switch>
      <Route path="/">
        <Landing onSignIn={handleSignIn} isSignedIn={isAuthenticated} onSignOut={handleSignOut} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
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
