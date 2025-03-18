import { Screening } from "../models/screeningModel.js";
import { Film } from "../models/filmModel.js";
import { Theater } from "../models/theaterModel.js";

// Create a new screening
export const createScreening = async (req, res) => {
    try {
        const { filmId, theaterId, showtime, availableSeats, price } = req.body;

        // Validate if the film exists
        const film = await Film.findById(filmId);
        if (!film) {
            return res.status(404).json({ message: "Film not found" });
        }

        // Validate if the theater exists
        const theater = await Theater.findById(theaterId);
        if (!theater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        // Create a new screening
        const screening = new Screening({
            filmId,
            theaterId,
            showtime,
            availableSeats,
            bookedSeats: 0,
            price,
        });

        await screening.save();

        res.status(201).json({ data: screening, message: "Screening created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Get all screenings for a specific film
export const getFilmScreenings = async (req, res) => {
    try {
        const { filmId } = req.params;

        // Find all screenings for the film
        const screenings = await Screening.find({ filmId }).populate('theaterId', 'name').sort({ showtime: 1 });

        if (!screenings.length) {
            return res.status(404).json({ message: "No screenings found for this film" });
        }

        res.status(200).json({ data: screenings, message: "Screenings fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Get all screenings for a specific theater
export const getTheaterScreenings = async (req, res) => {
    try {
        const { theaterId } = req.params;

        // Find all screenings for the theater
        const screenings = await Screening.find({ theaterId }).populate('filmId', 'title').sort({ showtime: 1 });

        if (!screenings.length) {
            return res.status(404).json({ message: "No screenings found for this theater" });
        }

        res.status(200).json({ data: screenings, message: "Screenings fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Update a screening
export const updateScreening = async (req, res) => {
    try {
        const { screeningId } = req.params;
        const updates = req.body;

        // Find the screening by ID and update it
        const updatedScreening = await Screening.findByIdAndUpdate(screeningId, updates, { new: true });

        if (!updatedScreening) {
            return res.status(404).json({ message: "Screening not found" });
        }

        res.status(200).json({ data: updatedScreening, message: "Screening updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Delete a screening
export const deleteScreening = async (req, res) => {
    try {
        const { screeningId } = req.params;

        // Find and delete the screening
        const deletedScreening = await Screening.findByIdAndDelete(screeningId);

        if (!deletedScreening) {
            return res.status(404).json({ message: "Screening not found" });
        }

        res.status(200).json({ message: "Screening deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Get a single screening by ID
export const getScreeningById = async (req, res) => {
    try {
        const { screeningId } = req.params;

        // Find the screening by ID
        const screening = await Screening.findById(screeningId)
            .populate('filmId', 'title')
            .populate('theaterId', 'name');

        if (!screening) {
            return res.status(404).json({ message: "Screening not found" });
        }

        res.status(200).json({ data: screening, message: "Screening fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
