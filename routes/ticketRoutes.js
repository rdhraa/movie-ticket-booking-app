import express from 'express';
import { cancelTicket, getTicket, getUserTickets } from '../controllers/ticketController.js';
import { authUser } from '../middlewares/authUser.js';
import { authTheater } from '../middlewares/authTheater.js';


const router = express.Router();
router.get('/my-tickets', authUser, getUserTickets);
router.get('/:ticketId',authUser,authTheater, getTicket);
router.patch("/:ticketId/cancel",authUser,cancelTicket)


export {router as ticketRouter}
