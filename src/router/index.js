import { Navigate } from "react-router-dom";
import Login from "../pages/login/login";

const routes = [
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/login',
    element: <Login />
  },
];

export default routes