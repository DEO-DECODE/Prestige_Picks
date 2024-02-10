import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      /*
        The Provider object is an instance a configuration object that you can use
        for triggering Authentication actions.
      */
      const auth = getAuth(app);
      /*
      The Auth variable essentially holds an instance that you can use for various Authentication related Purpose.
      */
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/v1/auth/google", {
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
      const data = await res.json();
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="btn btn-warning"
    >
      Continue with google
    </button>
  );
};

export default OAuth;
