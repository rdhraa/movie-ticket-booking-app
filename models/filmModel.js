import mongoose, { Schema } from "mongoose";

const filmSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: [String],
    required: true,  
  },
  duration: {
    type: Number,  
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  cast: [{
    type: String, 
    required: true
  }],
  language: {
    type: String,
    required: true
  },
  Image: {
    type: String,  
    default:"https://unframed.lacma.org/sites/default/files/styles/article_full/public/default_images/placeholder.jpg?itok=HWXuca-K"
  },
  rating: {
    type: Number,  
    min: 1,
    max: 10,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
    required: true,
  },
  isActive:{
    type:Boolean,
    default:true,
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

filmSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});
export const Film = mongoose.model('Film', filmSchema);
