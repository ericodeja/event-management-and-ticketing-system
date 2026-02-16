import express from "express";
import ticketController from "../controllers/ticket.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/buy/:eventId", auth, ticketController.buyTicket);

export default router;
