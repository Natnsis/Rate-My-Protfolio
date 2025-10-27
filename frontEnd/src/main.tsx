import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/ui/theme-provider.tsx";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Leaderboards from "./pages/Leaderboards.tsx";
import Ai from "./pages/Ai.tsx";
import Comment from "./pages/Comment.tsx";
import { useAuthStore } from "./store/AuthStore.ts";
import { useEffect, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
function RootRedirectWrapper() {
  const token = useAuthStore((s) => s.token);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  if (!checked) return null;

  return token ? <Navigate to="/dashboard" replace /> : <App />;
}

const router = createBrowserRouter([
  { path: "/", element: <RootRedirectWrapper /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/leaderboards", element: <Leaderboards /> },
  { path: "/bot", element: <Ai /> },
  { path: "/report", element: <Comment /> },
]);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <RouterProvider router={router} />
  </ThemeProvider>
);
