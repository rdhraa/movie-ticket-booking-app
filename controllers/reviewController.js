import { Film } from "../models/filmModel.js";
import { Review } from "../models/reviewModel.js";

export const addReview = async (req, res, next) => {
    try {
        const { filmId, rating, comment } = req.body;
        const userId = req.user.id;

        
        const film = await Film.findById(filmId);
        if (!film) {
            return res.status(404).json({ message: "Film not found" });
        }
        if (rating > 5 || rating < 1) {
            return res.status(400).json({ message: "Please provide a rating between 1 and 5" });
        }

       
        if (comment && comment.trim().length > 500) {
            return res.status(400).json({ message: "Comment is too long (max 500 characters)" });
        }

        
        const review = await Review.findOneAndUpdate(
            { userId, filmId }, 
            { rating, comment }, 
            { new: true, upsert: true } 
        );

        res.status(201).json({ data: review, message: "Review added/updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};



export const getFilmReviews = async (req, res) => {
    try {
        const { filmId } = req.params;

        const reviews = await Review.find({ filmId }).populate("userId", "name").sort({ createdAt: -1 });

        // if (!reviews.length) {
        //     return res.status(404).json({ message: "No reviews found for this film" });
        // }

        res.status(200).json({ data: reviews, message: "film reviews fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ message: "Review not found or not authorized" });
        }

        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const getAverageRating = async (req, res) => {
    try {
        const { filmId } = req.params;

        const reviews = await Review.find({ filmId });

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this film" });
        }

        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

        res.status(200).json({ data: averageRating, message: "Average rating fetched" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


export const getUserReviews = async (req, res) => {
    try {
        const {userId} = req.params;  

        // Fetch all reviews made by the specific user
        const reviews = await Review.find( userId ).populate("filmId", "title").sort({ createdAt: -1 });
        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found for this user" });
        }

        res.status(200).json({ data: reviews, message: "User's reviews fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
