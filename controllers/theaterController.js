import { Theater } from "../models/theaterModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

// Controller for creating a theater
export const createTheater = async (req, res, next) => {
  try {
    const { name, location, city, country, email,mobile, password, screens,role} = req.body;
       console.log("=======",name,location,city,country,email,mobile,password,screens,role)
    // Validate data
    if (!name || !location || !city || !country || !email || !mobile||!password || !screens||!role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if theater already exists
    const theaterExist = await Theater.findOne({ email });

    if (theaterExist) {
      return res.status(400).json({ message: "Theater already exists" });
    }

    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Create a new theater document
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

    // Save the theater to the database
    await newTheater.save();

    // Generate a token
    const token = generateToken(newTheater._id, "theater");

    res.cookie("token", token,{
      sameSite: NODE_ENV === "production" ? "None" : "Lax",
      secure: NODE_ENV === "production",
      httpOnly: NODE_ENV === "production",
    })
    delete theaterExist._doc.password;

    res.json({ data: newTheater, message: "Theater created successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    console.log(error);
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

// Controller for updating theater profile
export const theaterProfileUpdate = async (req, res, next) => {
  try {
    const { name, location, city, country, email, password, screens, profilePic } = req.body;


    // Check if password is being updated and hash it
    let updatedPassword = password;
    if (password) {
      updatedPassword = bcrypt.hashSync(password, 10);
    }

    const theaterId = req.user.id;

    // Update the theater
    const updatedTheater = await Theater.findByIdAndUpdate(
      theaterId,
      { 
        name, 
        location, 
        city, 
        country, 
        email, 
        password: updatedPassword, 
        screens, 
        profilePic: profilePic || "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg" 
      },
      { new: true }
    );

    res.json({ data: updatedTheater, message: "Theater profile updated successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
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

// Controller for checking if the theater is authorized (middleware use case)
export const checkTheater = async (req, res, next) => {
  try {
    res.json({ message: "Theater authorized" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};
