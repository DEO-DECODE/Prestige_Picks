import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      // console.log("Token before request:", auth.token);

      try {
        const response = await fetch("/api/v1/auth/admin-auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          /*
           By including the token in the Authorization header, the server can use it to determine if the user making the request has the necessary permissions to access the requested resource or perform a specific action
           */
        });

        const data = await response.json();
        if (data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Error fetching admin-auth:", error);
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
