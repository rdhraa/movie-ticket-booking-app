import mongoose, { Schema } from 'mongoose';

const screeningSchema = new Schema({
    filmId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Film', 
        required: true,
    },
    theaterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theater', 
        required: true,
    },
    showtime: {
        type: Date,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
        min: 1,
    },
    bookedSeats: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


screeningSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const Screening = mongoose.model('Screening', screeningSchema);


