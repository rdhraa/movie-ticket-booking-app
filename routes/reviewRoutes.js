import e from "express";
import { authUser } from "../middlewares/authUser.js";
import { addReview, deleteReview, getAverageRating, getFilmReviews,getUserReviews } from "../controllers/reviewController.js";

const router = e.Router();


//add review,update
router.post("/add-review",authUser,addReview)


//delete review
router.delete("/delete-review/:reviewId",authUser,deleteReview)

// get film reviews
router.get('/film-reviews/:filmId',getFilmReviews)


// film avg  rating
router.get("/avg-rating/:filmId",getAverageRating)


// get film reviews by specific user
router.get("/reviews-user/:userId", getUserReviews);

export { router as reviewRouter };