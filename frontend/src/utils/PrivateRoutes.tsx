import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoutes() {
  const auth = localStorage.getItem("token") ? true : false;

  return auth ? <Outlet /> : <Navigate to={"/signin"}></Navigate>;
}
