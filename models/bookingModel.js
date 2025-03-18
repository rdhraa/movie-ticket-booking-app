import mongoose,{Schema}from "mongoose";
import { ticketSchema } from './ticketModel.js';
const bookingSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    },
    screeningId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screening',  
        required: true,
    },
    numSeats: {
        type: Number,
        required: true,
    },
    tickets: [ticketSchema],  
    totalPrice: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Booking = mongoose.model('Booking', bookingSchema);