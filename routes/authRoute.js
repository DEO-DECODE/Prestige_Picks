import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPassword,
  updateProfileController,
  resetPassword,
  google
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/register", registerController);
router.post("/login", loginController);
router.post("/google", google);
router.post("/forgot-password", forgotPassword);
router.put("/password/reset/:token", resetPassword);
router.get("/test", requireSignIn, isAdmin, testController);
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/profile", requireSignIn, updateProfileController);

export default router;
