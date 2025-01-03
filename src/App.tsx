import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Error from "./components/error";
import RootLayout from "./components/root-layout";
import Home from "./routes/home";
import ScoringPrototypePage from "./routes/ScoringPrototypePage";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/scoring-system-prototype",
        element: <ScoringPrototypePage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
