import e from 'express';
import { createBooking, createBookingAfterPayment } from '../controllers/bookingController.js';
import { authUser } from '../middlewares/authUser.js';

const router = e.Router();

// Route for creating a booking
router.post('/create',authUser, createBooking);
router.post('/create-after-payment', authUser, createBookingAfterPayment);

export {router as bookingRouter}
