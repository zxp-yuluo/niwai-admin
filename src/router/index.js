import { Navigate } from "react-router-dom";
import Login from "../pages/login/login";
import Admin from "../pages/admin/admin";

const routes = [
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <Admin />
  },
];

export default routes