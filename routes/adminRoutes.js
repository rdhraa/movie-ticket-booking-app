import e from "express";
import {
  getAllUsers,
  getAllTheaters,
  getUserProfile,
  getTheaterProfile,
  deactivateUser,
  deactivateTheater,
  deleteUser,
  deleteTheater,
  adminSignup,
  adminLogin,
  getAdminDashboardStats,
  updateTheaterStatus,
  checkAdmin,
  approveTheater,
  rejectTheater,
  getAllMovies,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  logoutAdmin
} from "../controllers/adminController.js";
import { authAdmin } from "../middlewares/authAdmin.js";
import { upload } from "../middlewares/multer.js";

const router = e.Router();
//signup
router.post("/signup",adminSignup)
//login
router.post("/login",adminLogin)
//admin logout
router.get("/logout", logoutAdmin);

// Get admin profile
router.get("/profile", authAdmin, getAdminProfile);

// Update profile
router.put("/update", authAdmin,upload.single("profilePic"), updateAdminProfile);

// Change password
router.put("/change-password", authAdmin, changeAdminPassword);

// Get all users
router.get("/users",authAdmin, getAllUsers);

// Get a specific user by ID
router.get("/users/:id",authAdmin, getUserProfile);


// Deactivate a user account
router.put("/users/deactivate/:id",authAdmin, deactivateUser);

// Delete a user account
router.delete("/users/:id",authAdmin, deleteUser);

router.patch("/theaters/:id/status", authAdmin, updateTheaterStatus);

router.patch("/approve-theater/:id", authAdmin, approveTheater);
router.patch("/reject-theater/:id", authAdmin, rejectTheater);

// Get all theaters
router.get("/theaters",authAdmin, getAllTheaters);

// Get a specific theater by ID
router.get("/theaters/:id",authAdmin, getTheaterProfile);

// Deactivate a theater
router.put("/theaters/deactivate/:id",authAdmin, deactivateTheater);

// Delete a theater
router.delete("/theaters/:id",authAdmin, deleteTheater);

// Admin dashboard stats route
router.get("/dashboard-stats", authAdmin, getAdminDashboardStats);

// get all movies
router.get("/movies", authAdmin, getAllMovies);


router.get("/check-admin", authAdmin, checkAdmin);
export { router as adminRouter };
