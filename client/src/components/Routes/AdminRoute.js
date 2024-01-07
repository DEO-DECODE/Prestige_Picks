import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
// import axios from "axios";
import Spinner from "../Spinner";

// export default function PrivateRoute() {
//   const [ok, setOk] = useState(false);
//   const [auth, setAuth] = useAuth();

//   useEffect(() => {
//     const authCheck = async () => {
//       console.log('Token before request:', auth.token);
//       const res = await axios.get("/api/v1/auth/admin-auth");
//       console.log('Axios response:', res);
//       if (res.data.ok) {
//         setOk(true);
//       } else {
//         setOk(false);
//       }
//     };
//     console.log(auth.token);
//     if (auth?.token) authCheck();
//   }, [auth?.token]);

//   return ok ? <Outlet /> : <Spinner path="" />;
// }
export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      console.log("Token before request:", auth.token);

      try {
        const response = await fetch("/api/v1/auth/admin-auth", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });

        // if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
        // } else {
        //   // Handle non-OK responses (e.g., 401 Unauthorized)
        //   console.error("Failed to fetch admin-auth:", response.statusText);
        //   setOk(false);
        // }
      } catch (error) {
        console.error("Error fetching admin-auth:", error);
        setOk(false);
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
}
