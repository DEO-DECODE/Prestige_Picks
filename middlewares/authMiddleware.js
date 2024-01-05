import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import dotenv from "dotenv";
dotenv.config({ path: "config.env" });
// //Protected Routes token base
// export const requireSignIn = async (req, res, next) => {
//   try {
//     console.log(req.headers.authorization);
//     const decode = JWT.verify(
//       req.headers.authorization,
//       process.env.JWT_SECRET
//     );
//     req.user = decode;
//     next();
//   } catch (error) {
//     console.log(error);
//   }
// };

export const requireSignIn = async (req, res, next) => {
  try {
    
    let token= req.headers.authorization;
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader);
    const bearer = bearerHeader.split(" ");
    if (bearer.length === 2) {
      // Get the token from the split array
      token = bearer[1];
    }
    console.log('Received Token:', token);
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token not provided' });
    }

    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.error(error);

    // Check for specific JWT errors and handle them accordingly
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    // Handle other errors (e.g., token expired)
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
