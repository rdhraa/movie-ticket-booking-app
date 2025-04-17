import e from "express";
import {
  createTheater,
  theaterLogin,
  theaterProfile,
  theaterProfileUpdate,
  theaterLogout,
  getDashboardStats,
  getTodayScreenings,
  getRecentBookings,
  getTheaterBookings,
  changeTheaterPassword,
  checkTheater
  
} from "../controllers/theaterController.js";
import { authTheater } from "../middlewares/authTheater.js";
import { upload } from "../middlewares/multer.js";
const router = e.Router();

// Create new theater
router.post("/signup", createTheater);

// Theater login
router.post("/login", theaterLogin);

// Get theater profile
router.get("/profile",authTheater,theaterProfile);

// Update theater profile
router.put("/update", authTheater,upload.single("profilePic"),theaterProfileUpdate);

// Theater logout
router.post("/logout", theaterLogout);
router.get("/check-theater", authTheater, checkTheater);


router.get("/dashboard", authTheater, getDashboardStats);

router.get("/today-screenings", authTheater, getTodayScreenings);
router.get("/recent-bookings", authTheater, getRecentBookings);
router.get("/my-bookings", authTheater, getTheaterBookings);
router.put("/change-password", authTheater, changeTheaterPassword);



export { router as theaterRouter };
