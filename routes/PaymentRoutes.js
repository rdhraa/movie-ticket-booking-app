import express from "express";
import Stripe from "stripe";
import { authUser } from "../middlewares/authUser.js";

const router = express.Router();
const stripe = new Stripe(process.env.Stripe_Private_Api_Key);
const client_domain = process.env.CLIENT_DOMAIN;

router.post("/create-checkout-session", authUser, async (req, res) => {
    try {
  
      const {
        filmTitle,
        theaterName,
        showtime,
        selectedSeats,
        pricePerSeat,
      } = req.body;
  
      if (!selectedSeats || selectedSeats.length === 0) {
        return res.status(400).json({ error: "No seats selected" });
      }
  
      const lineItems = selectedSeats.map((seat) => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: `${filmTitle} - ${theaterName} - ${seat}`,
            description: `Showtime: ${new Date(showtime).toLocaleString()}`,
          },
          unit_amount: Math.round(pricePerSeat * 100),
        },
        quantity: 1,
      }));
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${client_domain}/user/payment/success`,
        cancel_url: `${client_domain}/user/payment/cancel`,
      });
  
      res.json({ success: true, sessionId: session.id });
    } catch (error) {
      console.error("Stripe Error:", error);
      res.status(error.statusCode || 500).json({
        error: error.message || "Internal Server Error",
      });
    }
  });
  export { router as paymentRouter };  