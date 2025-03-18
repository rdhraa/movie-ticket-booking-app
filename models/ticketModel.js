import mongoose, { Schema } from 'mongoose';

const ticketSchema = new Schema({
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
    seatNumber: {
        type: String, 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'pending'],
        default: 'booked', 
    },
    bookingTime: {
        type: Date,
        default: Date.now,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending', 
    },
    ticketNumber: {
        type: String,
        required: true,
        unique: true, 
    },
    isRefunded: {
        type: Boolean,
        default: false, 
    },
    refundAmount: {
        type: Number, 
        default: 0, 
    }
});

ticketSchema.pre('save', function (next) {
    // If generating a unique ticket number or adding any other pre-save logic
    if (!this.ticketNumber) {
        this.ticketNumber = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
    next();
});
export { ticketSchema };

export const Ticket = mongoose.model('Ticket', ticketSchema);
