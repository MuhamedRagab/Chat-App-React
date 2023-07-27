import { createBrowserRouter } from "react-router-dom";

//** Layout is the root component of the router, and the child component of the layout is the page component
import Layout from "../layout/Layout";

//** Import the page component here
import Home from "../pages/index.tsx";
import Room from "../pages/rooms/[id].tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/rooms/:id",
        Component: Room,
      },
    ],
  },
]);
