import e from "express"
import {userRouter} from "./userRoutes.js"
import {adminRouter} from "./adminRoutes.js"
import { theaterRouter } from "./theaterRoutes.js"
const router = e.Router()

router.use("/user",userRouter)
router.use("/admin",adminRouter)
router.use("/theater",theaterRouter)
//theater
//film
//payment
//screening
//ticket







export {router as apiRouter}