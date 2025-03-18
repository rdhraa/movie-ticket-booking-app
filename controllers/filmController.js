import { cloudinaryInstance } from "../Config/cloudinary.js";
import { Film } from "../models/filmModel.js";

export const getAllFilms = async (req,res,next)=>{
    try {
        const filmList = await Film.find().select("-description -duration -releaseDate -director -cast")
        res.json({ data:filmList, message: "user autherized" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
};

export const aboutFilm = async (req,res,next)=>{
    try {
        const {filmId}=req.params

        const aboutFilm = await Film.findById(filmId);
        //const filmReview = await Review.findById(filmId)

        res.json({ data:aboutFilm,message: "user autherized" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
};

export const addFilm = async (req,res,next)=>{
    try {
        const{title,description,genre,duration,releaseDate,director,cast,language,rating}=req.body;
        const theaterId = req.user.id

        

        const cloudinaryRes= await cloudinaryInstance.uploader.upload(req.file.path)
        

        const newFilm =new Film({title,description,genre,duration,releaseDate,director,cast,language,Image:cloudinaryRes.url,theater:theaterId})
        await newFilm.save()
        res.json({data:newFilm,message:"film addedd successfully"})
        
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server" });
    }
};

//update film

export const updateFilm = async (req, res, next) => {
    try {
        const { filmId } = req.params;
        const { title, description, genre, duration, releaseDate, director, cast, language, rating } = req.body;
        const theaterId = req.user.id;

        let updatedFilmData = {
            title,
            description,
            genre,
            duration,
            releaseDate,
            director,
            cast,
            language,
            rating,
            theater: theaterId
        };

        // If the user is updating the image
        if (req.file) {
            const cloudinaryRes = await cloudinaryInstance.uploader.upload(req.file.path);
            updatedFilmData.Image = cloudinaryRes.url;
        }

        // Find and update the film
        const updatedFilm = await Film.findByIdAndUpdate(filmId, updatedFilmData, { new: true });

        if (!updatedFilm) {
            return res.status(404).json({ message: "Film not found" });
        }

        res.json({ data: updatedFilm, message: "Film updated successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};

//serach film
export const searchFilms = async (req, res, next) => {
    try {
        const { title, genre, language } = req.query; 

        // Build search criteria
        const searchCriteria = {};

        if (title) searchCriteria.title = { $regex: title, $options: "i" }; 
        if (genre) searchCriteria.genre = { $in: genre.split(",") }; 
        if (language) searchCriteria.language = { $regex: language, $options: "i" }; 

        // Search for films based on criteria
        const films = await Film.find(searchCriteria);

        res.json({ data: films, message: "Search results" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


//delete film
export const deleteFilm = async (req, res, next) => {
    try {
        const { filmId } = req.params;

        // Find and delete the film
        const deletedFilm = await Film.findByIdAndDelete(filmId);

        if (!deletedFilm) {
            return res.status(404).json({ message: "Film not found" });
        }

        res.json({ message: "Film deleted successfully" });
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
    }
};


    
