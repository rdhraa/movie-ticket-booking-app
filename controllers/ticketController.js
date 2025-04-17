import { Ticket } from "../models/ticketModel.js";
import { User } from "../models/userModel.js";

// View specific ticket details by ticket number
export const getTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId); 

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }

        res.status(200).json({ ticket });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Cancel a specific ticket
export const cancelTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId); 
        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" });
        }
        if (ticket.status === "cancelled") {
            return res.status(400).json({ message: "Ticket is already cancelled" });
        }

        // Update the ticket status to cancelled
        ticket.status = "cancelled";

        await ticket.save();

        res.status(200).json({ message: "Ticket cancelled successfully", ticket });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


// Get all tickets of the logged-in user
export const getUserTickets = async (req, res) => {
    try {
      const userId = req.user.id; 
      
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const tickets = await Ticket.find({ userId }).populate("screeningId");
  
      res.status(200).json({ tickets });
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      res.status(500).json({ message: "Internal server error", error });
    }
  };
  
  