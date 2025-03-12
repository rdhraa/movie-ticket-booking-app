import mongoose,{Schema} from "mongoose"
const userSchema= new Schema(
    {
       name: {
        type: String,
        required: true,
        maxlength:50,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength:30,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email'],
      },
      mobile:{
        type:String,
        required:true,
        unique:true,
      },
      profilePic:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
      },
      password: {
        type: String,
        required: true,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true, 
    }
  );
  export const User = mongoose.model("User", userSchema);