import { Ticket } from "../models/ticketModel.js";

// View specific ticket details by ticket number
export const getTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;

        const ticket = await Ticket.findById(ticketId);  // Corrected here

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

        // Check if the ticket can be canceled based on its status
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
