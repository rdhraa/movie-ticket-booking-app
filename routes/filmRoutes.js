import e from "express"
import { aboutFilm, addFilm, getAllFilms,updateFilm,deleteFilm,searchFilms,getTheaterFilms } from "../controllers/filmController.js";
import { authTheater } from "../middlewares/authTheater.js";
import { authUser } from "../middlewares/authUser.js";
import { upload } from "../middlewares/multer.js";

const router = e.Router();
//get all films
router.get("/film-list",getAllFilms)
//about a specifuc film
router.get("/about-film/:filmId",aboutFilm)
//add film
router.post("/add-film",authTheater,upload.single("Image"),addFilm)

//update film
router.put("/update-film/:filmId", authTheater, upload.single("image"), updateFilm);
//fetch film based on theater

//search film
router.get("/search-films", authUser,authTheater, searchFilms);
//delete film
router.delete("/delete-film/:filmId",authTheater, deleteFilm);

router.get("/my-films", authTheater, getTheaterFilms);

export {router as filmRouter}