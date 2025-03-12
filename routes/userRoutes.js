import e from "express";
import { 
  userLogin, 
  userProfile, 
  userSignup, 
  userProfileUpdate, 
  deactivateAccount, 
  deleteAccount, 
  userLogout,
  checkUser 
} from "../controllers/userController.js";
import { authUser } from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = e.Router();

// Sign up
router.post("/signup", userSignup);

// Login
router.put("/login", userLogin);

// Get user profile
router.get("/profile",authUser,userProfile);

// Update user profile
router.put("/update",authUser, userProfileUpdate);

// Deactivate user account
router.put("/deactivate",authUser,authAdmin, deactivateAccount);

// Delete user account
router.delete("/delete-account",authUser,authAdmin,deleteAccount);

// Logout user
router.get("/logout", userLogout);

// Check if user is authorized
router.get("/check",authUser, checkUser);

// Forgot password (password reset link)
router.post("/password-forgot", (req, res) => {
  // Implement the logic for forgot password (sending reset link)
  res.json({ message: "Password reset link sent" });
});

// Change password
router.put("/password-change", (req, res) => {
  // Implement the logic for changing password
  res.json({ message: "Password updated successfully" });
});

export { router as userRouter };
