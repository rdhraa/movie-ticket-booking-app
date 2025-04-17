import { Screening } from "../models/screeningModel.js";
import { Booking } from "../models/bookingModel.js";
import { Ticket } from "../models/ticketModel.js";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.Stripe_Private_Api_Key); 

export const createBooking = async (req, res) => {
    try {
        const { screeningId, numSeats, seatNumbers } = req.body;
        const userId = req.user.id;  

        const screening = await Screening.findById(screeningId);

        if (!screening) {
            return res.status(404).json({ message: "Screening not found" });
        }

        if (screening.availableSeats < numSeats) {
            return res.status(400).json({ message: "Not enough available seats" });
        }

        if (seatNumbers.length !== numSeats) {
            return res.status(400).json({ message: "Number of seat numbers provided does not match the number of seats being booked" });
        }

        const totalPrice = screening.price * numSeats;
        const booking = new Booking({
            userId,
            screeningId,
            numSeats,
            totalPrice,
        });

        
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

       
        booking.tickets = tickets;
        await booking.save();
        screening.availableSeats -= numSeats;
        screening.bookedSeats.push(...seatNumbers);  
        await screening.save();
        res.status(201).json({ message: "Booking created successfully", booking });
    } catch (error) {
        console.error(error);  
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const createBookingAfterPayment = async (req, res) => {
    try {
      const { sessionId, screeningId, numSeats, seatNumbers } = req.body;
      const userId = req.user.id;
  
      // Verify Stripe session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: "Payment not completed." });
      }
  
      //  Find screening
      const screening = await Screening.findById(screeningId);
      if (!screening) {
        return res.status(404).json({ message: "Screening not found" });
      }
  
      //  Validate seats
      if (screening.availableSeats < numSeats) {
        return res.status(400).json({ message: "Not enough available seats" });
      }
  
      if (seatNumbers.length !== numSeats) {
        return res.status(400).json({ message: "Mismatch in number of seats and seatNumbers" });
      }
  
      //  Calculate total price
      const totalPrice = screening.price * numSeats;
  
      //  Create booking
      const booking = new Booking({
        userId,
        screeningId,
        numSeats,
        totalPrice,
      });
  
      //  Create tickets with paymentStatus: 'success'
      const tickets = await Promise.all(
        seatNumbers.map(async (seat) => {
          const ticket = new Ticket({
            seatNumber: seat,
            price: screening.price,
            ticketNumber: `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            screeningId: screening._id,
            userId: userId,
            paymentStatus: 'success', 
          });
  
          await ticket.save();
          return ticket;
        })
      );
      booking.tickets = tickets;
      await booking.save();
  
      screening.availableSeats -= numSeats;
      screening.bookedSeats.push(...seatNumbers);
      await screening.save();
  
      
      res.status(201).json({ message: "Booking created successfully after payment", booking });
  
    } catch (err) {
      console.error("Booking creation failed:", err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  };


  