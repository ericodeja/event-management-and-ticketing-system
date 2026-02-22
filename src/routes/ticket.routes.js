import express from "express";
import ticketController from "../controllers/ticket.controller.js";
import auth from "../middleware/auth.js";
import authorize from '../middleware/roles.js'

const router = express.Router();

router.post("/buy/:eventId", auth, ticketController.buyTicket);

router.get("/verify", auth, authorize("admin"), ticketController.verifyTicket);

export default router;
