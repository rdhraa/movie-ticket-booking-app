import e from "express";
import { authUser } from "../middlewares/authUser.js";
import { addReview, deleteReview, getAverageRating, getFilmReviews,getUserReviews } from "../controllers/reviewController.js";

const router = e.Router();

//update review,
//add review
router.post("/add-review",authUser,addReview)


//delete review
router.delete("/delete-review/:reviewId",authUser,deleteReview)

// get film reviews
router.get('/film-reviews/:filmId',getFilmReviews)


// film avg  rating
router.get("/avg-rating/:filmId",getAverageRating)


// get course reviews by specific user
router.get("/reviews-user", getUserReviews);

export { router as reviewRouter };