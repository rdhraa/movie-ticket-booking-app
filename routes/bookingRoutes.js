import e from 'express';
import { createBooking } from '../controllers/bookingController.js';
import { authUser } from '../middlewares/authUser.js';

const router = e.Router();

// Route for creating a booking
router.post('/create',authUser, createBooking);

export {router as bookingRouter}
