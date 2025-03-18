import e from "express"
import { aboutFilm, addFilm, getAllFilms,updateFilm,deleteFilm,searchFilms } from "../controllers/filmController.js";
import { authTheater } from "../middlewares/authTheater.js";
import { authUser } from "../middlewares/authUser.js";
import { upload } from "../middlewares/multer.js";

const router = e.Router();
//get all films
router.get("/film-list",authUser,authTheater,getAllFilms)
//about a specifuc film
router.get("/about-film/:filmId",authUser,authTheater,aboutFilm)
//add film
router.post("/add-film",authTheater,upload.single("image"),addFilm)

//update film
router.put("/update-film/:filmId", authTheater, upload.single("image"), updateFilm);
//fetch film based on theater

//search film
router.get("/search-films", authUser,authTheater, searchFilms);
//delete film
router.delete("/delete-film/:filmId",authTheater, deleteFilm);


export {router as filmRouter}