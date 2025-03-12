import mongoose, { Schema } from "mongoose";

const theaterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    location: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 50,
      match: [/\S+@\S+\.\S+/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
    },
    role: {
        type: String,
        enum: "theater",
        required: true,
        default: "theater",
      },
    screens: [
      {
        name: {
          type: String,
          required: true,
        },
        capacity: {
          type: Number,
          required: true,
        },
        facilities: [
          {
            type: String,
          },
        ],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, 
  }
);

export const Theater = mongoose.model("Theater", theaterSchema);


