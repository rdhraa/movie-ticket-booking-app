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
  adminLogin
} from "../controllers/adminController.js";

const router = e.Router();
//signup
router.post("/signup",adminSignup)
//login
router.post("/login",adminLogin)
// Get all users
router.get("/users", getAllUsers);

// Get a specific user by ID
router.get("/users/:id", getUserProfile);


// Deactivate a user account
router.put("/users/deactivate/:id", deactivateUser);

// Delete a user account
router.delete("/users/:id", deleteUser);

// Get all theaters
router.get("/theaters", getAllTheaters);

// Get a specific theater by ID
router.get("/theaters/:id", getTheaterProfile);

// Deactivate a theater
router.put("/theaters/deactivate/:id", deactivateTheater);

// Delete a theater
router.delete("/theaters/:id", deleteTheater);

export { router as adminRouter };
