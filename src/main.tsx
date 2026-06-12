import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AppStoreProvider } from "./store/AppStore";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import LearningPath from "./pages/LearningPath";
import StageDetail from "./pages/StageDetail";
import CommitmentLog from "./pages/CommitmentLog";
import RaidLog from "./pages/RaidLog";
import Templates from "./pages/Templates";
import Checklist from "./pages/Checklist";
import Drills from "./pages/Drills";
import Metrics from "./pages/Metrics";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "path", element: <LearningPath /> },
        { path: "path/:stageId", element: <StageDetail /> },
        { path: "commitments", element: <CommitmentLog /> },
        { path: "raid", element: <RaidLog /> },
        { path: "templates", element: <Templates /> },
        { path: "checklist", element: <Checklist /> },
        { path: "drills", element: <Drills /> },
        { path: "metrics", element: <Metrics /> },
      ],
    },
  ],
  // Honour the Vite base path so routing works under /toro-nfts/ on
  // GitHub Pages and at / in local dev.
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") }
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppStoreProvider>
      <RouterProvider router={router} />
    </AppStoreProvider>
  </StrictMode>
);
