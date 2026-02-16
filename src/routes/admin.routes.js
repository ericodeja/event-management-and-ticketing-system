import express from "express";
import auth from "../middleware/auth.js";
import adminControllers from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/tickets/:ticketId", auth, adminControllers.getTicketById);

router.get("/tickets", auth, adminControllers.allTickets);

router.get(
  "/event-revenue/:eventId",
  auth,
  adminControllers.getEventRevenueById,
);

router.get("/event-revenue", auth, adminControllers.getEventsRevenue);

//attendee list export (CSV)

export default router;
