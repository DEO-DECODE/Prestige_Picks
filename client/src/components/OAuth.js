import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import toast from "react-hot-toast";
import { useAuth } from "../context/auth";
import { useNavigate,useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FaGoogle } from "react-icons/fa";
const OAuth = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      /*
      The Provider object is an instance a configuration object that you can use
      for triggering Authentication actions.
      */
      const authUser = getAuth(app);
      /*
      The Auth variable essentially holds an instance that you can use for various Authentication related Purpose.
      */
      const result = await signInWithPopup(authUser, provider);
      console.log(result.user);
      const response = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.message);
        setAuth({
          ...auth,
          user: data.user,
          token: data.token,
        });
        localStorage.setItem("auth", JSON.stringify(data));
        navigate(location.state || "/");
        /*
         the state set in Spinner.js is accessed in Login.js through the location.state property. This is possible because the state option in navigate allows you to pass data between routes during navigation.
         */
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("could not sign in with google", error);
      // Additional logging
      if (error.code) {
        console.error("Error code:", error.code);
      }
      if (error.message) {
        console.error("Error message:", error.message);
      }
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="btn btn-warning"
    >
      Continue with <FaGoogle /> 
    </button>
  );
};

export default OAuth;
