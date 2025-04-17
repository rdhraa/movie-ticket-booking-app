import { Theater } from "../models/theaterModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { Screening } from "../models/screeningModel.js";
import moment from "moment";
import {Booking} from '../models/bookingModel.js';
import { Film } from "../models/filmModel.js";
import { cloudinaryInstance } from "../Config/cloudinary.js";
const NODE_ENV=process.env.NODE_ENV

// Controller for creating a theater
export const createTheater = async (req, res, next) => {
  try {
    const { name, location, city, country, email, mobile, password, screens, role } = req.body;

    if (!name || !location || !city || !country || !email || !mobile || !password || !screens || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const theaterExist = await Theater.findOne({ email });
    if (theaterExist) {
      return res.status(400).json({ message: "Theater already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newTheater = new Theater({
      name,
      location,
      city,
      country,
      email,
      mobile,
      password: hashedPassword,
      screens,
    });

    await newTheater.save();

    const token = generateToken(newTheater._id, "theater");

    res.cookie("token", token, {
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    });

    const theaterData = newTheater.toObject();
    delete theaterData.password;

    res.json({ data: theaterData, message: "Theater created successfully" });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};
// Controller for theater login
export const theaterLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if theater exists
    const theaterExist = await Theater.findOne({ email });

    if (!theaterExist) {
      return res.status(404).json({ message: "Theater not found" });
    }

    // Check if password matches
    const passwordMatch = bcrypt.compareSync(password, theaterExist.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(theaterExist._id, "theater");
    res.cookie("token", token,{
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    })

    // Hide password field
    delete theaterExist._doc.password;

    res.json({ data: theaterExist, message: "Login successful" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

// Controller for fetching theater profile
export const theaterProfile = async (req, res, next) => {
  try {
    const theaterId = req.user.id;
    const theaterData = await Theater.findById(theaterId).select("-password");

    res.json({ data: theaterData, message: "Theater profile fetched" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};


export const theaterProfileUpdate = async (req, res) => {
  try {
    const { name, location, city, country, email, screens, mobile, profilePic } = req.body;
    const theaterId = req.user.id; 

    let profilePicUrl = profilePic || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"; 

    if (req.file) {
      const cloudinaryRes = await cloudinaryInstance.uploader.upload(req.file.path, {
        folder: "theater-profile-pics",
        transformation: [{ width: 500, height: 500, crop: "fill" }],
      });
      profilePicUrl = cloudinaryRes.secure_url; 
    }

    // Update the theater profile in the database
    const updatedTheater = await Theater.findByIdAndUpdate(
      theaterId, 
      {
        $set: {
          name,
          location,
          city,
          country,
          email,
          screens,
          mobile,
          ...(profilePicUrl && { profilePic: profilePicUrl }), 
        },
      },
      { new: true, runValidators: true }
    ).select("-password"); 

    res.json({ data: updatedTheater, message: "Theater profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

//controller for changing password
export const changeTheaterPassword = async (req, res) => {
  try {
    const theaterId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const theater = await Theater.findById(theaterId);
    if (!theater) return res.status(404).json({ message: "Theater not found" });

    const isMatch = await bcrypt.compare(oldPassword, theater.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    theater.password = hashedNewPassword;
    await theater.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller for logging out the theater
export const theaterLogout = async (req, res, next) => {
  try {
    res.clearCookie("token",{
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
    })
    res.json({ message: "Theater logged out successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const checkTheater = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Theater authorized",
      data: req.user, 
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};



export const getDashboardStats = async (req, res) => {
  try {
    const theaterId = req.user.id;

    // Count total films for this theater
    const totalFilms = await Film.countDocuments({ theater: theaterId });

    // Get all screenings for this theater
    const screenings = await Screening.find({ theaterId }).select("_id");
    const screeningIds = screenings.map(screening => screening._id);

    // Get bookings for those screenings
    const bookings = await Booking.find({ screeningId: { $in: screeningIds } });

    const totalBookings = bookings.length;
    const revenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    const today = new Date();
    const upcomingShows = await Screening.countDocuments({
      theaterId,
      showtime: { $gte: today }
    });

    res.json({
      data: {
        totalFilms,
        totalBookings,
        revenue,
        upcomingShows
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err.message);
    res.status(500).json({ message: err.message || "Error fetching dashboard stats" });
  }
};




export const getTodayScreenings = async (req, res) => {
  try {
    const theaterId = req.user.id;
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();

    const screenings = await Screening.find({
      theaterId,
      showtime: { $gte: startOfDay, $lte: endOfDay },
    }).populate("filmId", "title");

    res.json({ data: screenings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching today's screenings" });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    const theaterId = req.user._id; 

    const screenings = await Screening.find({ theaterId }).select("_id");
    const screeningIds = screenings.map(screening => screening._id);

    const recentBookings = await Booking.find({ screeningId: { $in: screeningIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({
        path: "screeningId",
        populate: {
          path: "filmId",
          model: "Film",
          select: "title"
        }
      });

    const formattedBookings = recentBookings.map(booking => ({
      _id: booking._id,
      filmTitle: booking.screeningId?.filmId?.title || "Unknown",
      status: booking.paymentStatus || "unknown"
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error("Recent bookings error:", error.message);
    res.status(500).json({ message: "Failed to fetch recent bookings" });
  }
};

export const getTheaterBookings = async (req, res) => {
  try {
    const theaterId = req.user.id;

    // Find all screenings belonging to this theater
    const screenings = await Screening.find({ theaterId }, "_id");

    const screeningIds = screenings.map(s => s._id);

    const bookings = await Booking.find({ screeningId: { $in: screeningIds } })
      .populate({
        path: "screeningId",
        select: "showtime filmId screenName",
        populate: {
          path: "filmId",
          select: "title"
        }
      })
      .populate("userId", "name email");

    res.status(200).json({ data: bookings, message: "Bookings fetched successfully" });
  } catch (error) {
    console.error("Error fetching theater bookings", error);
    res.status(500).json({ message: "Internal server error" });
  }
};