import { Admin } from "../models/adminModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { User } from "../models/userModel.js";
import { Theater } from "../models/theaterModel.js";

// Admin Signup
export const adminSignup = async (req, res, next) => {
  try {
    const { name, email, password,mobile, role } = req.body;

    // Validate data
    if (!name || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if admin already exists
    const adminExist = await Admin.findOne({ email });

    if (adminExist) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // const passwordMatch = bcrypt.compareSync(password, adminExist.password);
    
    // if (!passwordMatch) {
    //         return res.status(401).json({ message: "invalid credentials" });
    // }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create new admin
    const newAdmin = new Admin({ name, email, password: hashedPassword, mobile, role });

    // Save admin to DB
    await newAdmin.save();

    // Generate a token
    const token = generateToken(newAdmin._id, "admin");

    res.cookie("token", token);

    res.json({ data: newAdmin, message: "Admin signed up successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
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

// Admin manages users (example: listing all users)
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
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json({ data: user, message: "User profile fetched successfully" });
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
  
  

// Admin manages theaters (example: listing all theaters)
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
    const  {userId}  = req.params;

    const user = await User.findById(userId);

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
      const { userId } = req.params;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (req.user.id === userId) {
        return res.status(400).json({ message: "Admin cannot delete themselves" });
      }
  
      await User.findByIdAndDelete(userId);
  
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
    }
  };
  


export const deactivateTheater = async (req, res) => {
    try {
      const theaterId = req.params.id; // Get the theater ID from the URL parameter
  
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
      const theaterId = req.params.id; // Get the theater ID from the URL parameter
  
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
 
  

  