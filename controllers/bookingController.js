import { Screening } from "../models/screeningModel.js";
import { Booking } from "../models/bookingModel.js";
import { Ticket } from "../models/ticketModel.js";

export const createBooking = async (req, res) => {
    try {
        const { screeningId, numSeats, seatNumbers } = req.body;
        const userId = req.user.id;  

        // Find the screening object by its ID
        const screening = await Screening.findById(screeningId);

        if (!screening) {
            return res.status(404).json({ message: "Screening not found" });
        }

        // Check if there are enough available seats
        if (screening.availableSeats < numSeats) {
            return res.status(400).json({ message: "Not enough available seats" });
        }

        // Ensure the number of seat numbers provided matches the number of seats being booked
        if (seatNumbers.length !== numSeats) {
            return res.status(400).json({ message: "Number of seat numbers provided does not match the number of seats being booked" });
        }

        // Calculate total price for the booking
        const totalPrice = screening.price * numSeats;

        // Create the Booking document
        const booking = new Booking({
            userId,
            screeningId,
            numSeats,
            totalPrice,
        });

        // Generate the tickets and save them to the database
        const tickets = await Promise.all(seatNumbers.map(async (seat) => {
            const ticketNumber = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            const ticket = new Ticket({
                seatNumber: seat,
                price: screening.price,
                ticketNumber: ticketNumber, 
                screeningId: screening._id, 
                userId: userId, 
            });

           
            await ticket.save();
            return ticket;  
        }));

        // Add the saved tickets to the booking document
        booking.tickets = tickets;

        // Save the Booking document (with tickets)
        await booking.save();

        // Update the screening to reflect the new number of available and booked seats
        screening.availableSeats -= numSeats;
        screening.bookedSeats.push(...seatNumbers);  // Flag the booked seats by pushing them to the bookedSeats array

        await screening.save();

        // Return the booking details including tickets
        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: "Internal server error", error });
    }
};