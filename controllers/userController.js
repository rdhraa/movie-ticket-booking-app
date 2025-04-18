import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";
import { cloudinaryInstance } from "../Config/cloudinary.js";
const NODE_ENV=process.env.NODE_ENV

export const userSignup = async (req, res, next) => {
    try {
        //collect user data
        const { name, email, password, confirmPassword, mobile, profilePic } = req.body;

        //data validation
        if (!name || !email || !password || !confirmPassword || !mobile) {
            return res.status(400).json({ message: "all fields are required" });
        }

        //check if already exist
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ message: "user already exist" });
        }

        //compare with confirm password
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "password does not match" });
        }

        //password hashing
        const hashedPassword = bcrypt.hashSync(password, 10);

        //save to db
        const newUser = new User({ name, email, password: hashedPassword, mobile, profilePic });
        await newUser.save();

        //generate token usig Id and role
        const token = generateToken(newUser._id, "user");
        res.cookie("token", token,{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        })

        res.json({ data: newUser, message: "signup success" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
        console.log(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        //collect user data
        const { email, password} = req.body;

        //data validation
        if (!email || !password) {
            return res.status(400).json({ message: "all fields required" });
        }

        // if (password !== confirmPassword) {
        //     return res.status(400).json({ message: "password not same" });
        // }

        // user exist - check
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({ message: "user not found" });
        }

        //password match with DB
        const passwordMatch = bcrypt.compareSync(password, userExist.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        if (!userExist.isActive) {
            return res.status(401).json({ message: "user account is not active" });
        }

        //generate token
        const token = generateToken(userExist._id, "user");

        //store token
        res.cookie("token", token,{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        })

        delete userExist._doc.password;
        res.json({ data: userExist, message: "Login success" });

        // {
        //     const { password, ...userDataWithoutPassword } = userExist;
        // res.json({ data: userDataWithoutPassword, message: "Login success" });
        // }
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
};

export const userProfile = async (req, res, next) => {
    try {
        //user Id
        const userId = req.user.id;
        const userData = await User.findById(userId).select("-password");

        res.json({ data: userData, message: "user profile fetched" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
};

export const userProfileUpdate = async (req, res) => {
    try {
      const { name, email, mobile } = req.body;

      let profilePicUrl;
      if (req.file) {
        const cloudinaryRes = await cloudinaryInstance.uploader.upload(req.file.path);
        profilePicUrl = cloudinaryRes.url;
      }
      
      const userId = req.user.id;
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            ...(name && { name }),
            ...(email && { email }),
            ...(mobile && { mobile }),
            ...(profilePicUrl && { profilePic: profilePicUrl }), 
          },
        },
        { new: true, runValidators: true }
      ).select("-password");
      
  
      res.json({ data: updatedUser, message: "User profile updated successfully" });
    } catch (error) {
      console.error(error);
      res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
  };
  


export const userLogout = async (req, res, next) => {
    try {
        res.clearCookie("token",{
            sameSite: NODE_ENV === "production" ? "None" : "Lax",
            secure: NODE_ENV === "production",
            httpOnly: NODE_ENV === "production",
        })
        res.json({  message: "user logout success" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
};


export const checkUser = async (req, res, next) => {
    try {

        res.json({  message: "user autherized" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
};

export const deactivateAccount = async (req, res, next) => {
    try {
      const userId = req.user.id; 
  
      // Find the user by ID and update their `isActive` field to false
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isActive: false },
        { new: true }
      );
  
      // Check if the user exists
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      res.clearCookie("token");
  
      res.json({ message: "User account has been deactivated successfully" });
    } catch (error) {
      res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
      console.log(error);
    }
  };

// Controller for deleting user account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id; 

    // Find the user and delete the account
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.clearCookie("token");

    res.json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
    console.log(error);
  }
};

export const changePassword = async (req, res) => {
    try {
      const userId = req.user.id;
      const { oldPassword, newPassword } = req.body;
  
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found." });
  
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect." });
      }
  
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
  
      res.json({ message: "Password updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message || "Internal server error" });
      console.log(error);
    }
  };
  
