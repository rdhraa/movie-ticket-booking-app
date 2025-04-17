import { Admin } from "../models/adminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { User } from "../models/userModel.js";
import { Theater } from "../models/theaterModel.js";
import { Film } from "../models/filmModel.js";
import {Booking} from "../models/bookingModel.js";
import { cloudinaryInstance } from "../Config/cloudinary.js";
// Admin Signup
export const adminSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, mobile, role } = req.body;

    // Validate input
    if (!name || !email || !password || !confirmPassword || !mobile || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if admin already exists
    const adminExist = await Admin.findOne({ email });
    if (adminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      mobile,
      role,
    });

    await newAdmin.save();

    // Generate token
    const token = generateToken(newAdmin._id, "admin");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(201).json({
      data: newAdmin,
      message: "Admin signed up successfully",
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Internal server error" });
  }
};


// Admin Login
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate data
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if admin exists
    const adminExist = await Admin.findOne({ email });

    if (!adminExist) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Verify password
    const passwordMatch = bcrypt.compareSync(password, adminExist.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(adminExist._id, "admin");

    res.cookie("token", token);

    // Hide password field
    delete adminExist._doc.password;

    res.json({ data: adminExist, message: "Login successful" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const logoutAdmin = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};


export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ data: admin, message: "Admin profile fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { name, email, mobile } = req.body;

    let profilePicUrl;

    if (req.file) {
      const cloudinaryRes = await cloudinaryInstance.uploader.upload(req.file.path);
      profilePicUrl = cloudinaryRes.url;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      {
        $set: {
          name,
          email,
          mobile,
          ...(profilePicUrl && { profilePic: profilePicUrl }),
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ data: updatedAdmin, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};



export const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};


// Admin manages users 
export const manageUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.json({ data: users, message: "Users fetched successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};


export const getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find();
      res.json({ data: users, message: "All users fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };


  export const getUserProfile = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ data: user, message: "User profile fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };
  
  
  

export const getAllTheaters = async (req, res, next) => {
    try {
      const theaters = await Theater.find();
      res.json({ data: theaters, message: "All theaters fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };


export const approveTheater = async (req, res) => {
  try {
    await Theater.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.status(200).json({ message: "Theater approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error approving theater", error: err });
  }
};

export const rejectTheater = async (req, res) => {
  try {
    await Theater.findByIdAndUpdate(req.params.id, { isApproved: false });
    res.status(200).json({ message: "Theater rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error rejecting theater", error: err });
  }
};


  export const getTheaterProfile = async (req, res, next) => {
    try {
      const theaterId = req.params.id;
      const theater = await Theater.findById(theaterId);
  
      if (!theater) {
        return res.status(404).json({ message: "Theater not found" });
      }
  
      res.json({ data: theater, message: "Theater profile fetched successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };
  
  

// Admin manages theaters
export const manageTheaters = async (req, res, next) => {
  try {
    const theaters = await Theater.find();

    res.json({ data: theaters, message: "Theaters fetched successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

// Admin can deactivate/reactivate a user
export const deactivateUser = async (req, res, next) => {
  try {
    const  {id}  = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive; 
    await user.save();

    res.json({ message: `User ${user.isActive ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (req.user.id === id) {
        return res.status(400).json({ message: "Admin cannot delete themselves" });
      }
  
      await User.findByIdAndDelete(id);
  
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };
  


export const deactivateTheater = async (req, res) => {
    try {
      const theaterId = req.params.id; 
  
      // Check if the theater exists
      const theater = await Theater.findById(theaterId);
  
      if (!theater) {
        return res.status(404).json({ message: "Theater not found" });
      }
  
      // Deactivate the theater by setting isActive to false
      theater.isActive = false;
  
      // Save the changes to the database
      await theater.save();
  
      res.json({ message: "Theater account deactivated successfully", data: theater });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };

  export const deleteTheater = async (req, res) => {
    try {
      const theaterId = req.params.id; 
  
      // Check if the theater exists
      const theater = await Theater.findById(theaterId);
  
      if (!theater) {
        return res.status(404).json({ message: "Theater not found" });
      }
  
      // Delete the theater from the database
      await Theater.findByIdAndDelete(theaterId);
  
      res.json({ message: "Theater account deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };
 
  
export const getAdminDashboardStats = async (req, res) => {
  try {
    console.log("Fetching dashboard stats");
    const totalUsers = await User.countDocuments();
    console.log("Total users:", totalUsers);
    const totalTheaters = await Theater.countDocuments();
    const totalMovies = await Film.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.json({
      data: {
        totalUsers,
        totalTheaters,
        totalMovies,
        totalBookings,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};



export const checkAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json({ data: admin });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
 
  
export const updateTheaterStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; 
  try {
    const updated = await Theater.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
};

export const getAllMovies = async (req, res) => {
  try {
    const movies = await Film.find().populate("_id", "name location"); 
    res.json({ data: movies, message: "Movies fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch movies" });
  }
};
