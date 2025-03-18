import e from "express"
import {userRouter} from "./userRoutes.js"
import {adminRouter} from "./adminRoutes.js"
import { theaterRouter } from "./theaterRoutes.js"
import { filmRouter } from "./filmRoutes.js"
import { reviewRouter } from "./reviewRoutes.js"
import { screeningRouter } from "./screeningRoutes.js"
import { bookingRouter } from "./bookingRoutes.js"
import { ticketRouter } from "./ticketRoutes.js"
const router = e.Router()

router.use("/user",userRouter)
router.use("/admin",adminRouter)
router.use("/theater",theaterRouter)
router.use("/film",filmRouter)
router.use("/review",reviewRouter)
router.use("/screening",screeningRouter)
router.use("/bookings", bookingRouter)
router.use("/tickets", ticketRouter)



export {router as apiRouter}