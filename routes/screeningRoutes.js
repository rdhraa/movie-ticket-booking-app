import e from 'express';
import {
    createScreening,
    getFilmScreenings,
    getTheaterScreenings,
    updateScreening,
    deleteScreening,
    getScreeningById
} from "../controllers/screeningController.js";
import { authTheater } from '../middlewares/authTheater.js';
import { authUser } from '../middlewares/authUser.js';

const router = e.Router();

// Route to create a new screening
router.post("/create-screening",authTheater, createScreening);

// Route to get all screenings for a specific film
router.get("/film/:filmId",authUser,getFilmScreenings);

// Route to get all screenings for a specific theater
router.get("/my-screenings", authTheater, getTheaterScreenings);

// Route to update a screening by its ID
router.put("/:screeningId",authTheater, updateScreening);

// Route to delete a screening by its ID
router.delete("/:screeningId",authTheater, deleteScreening);

// Route to get a single screening by its ID
router.get("/:screeningId",authTheater, getScreeningById);

export {router as screeningRouter};
