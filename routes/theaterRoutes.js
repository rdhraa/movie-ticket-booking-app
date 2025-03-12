import e from "express";
import {
  createTheater,
  theaterLogin,
  theaterProfile,
  theaterProfileUpdate,
  theaterLogout
} from "../controllers/theaterController.js";
import { authTheater } from "../middlewares/authTheater.js";

const router = e.Router();

// Create new theater
router.post("/create", createTheater);

// Theater login
router.put("/login", theaterLogin);

// Get theater profile
router.get("/profile",authTheater,theaterProfile);

// Update theater profile
router.put("/update", authTheater,theaterProfileUpdate);

// Theater logout
router.post("/logout", theaterLogout);

export { router as theaterRouter };
