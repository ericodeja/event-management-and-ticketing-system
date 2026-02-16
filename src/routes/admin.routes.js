import express from "express";
import auth from "../middleware/auth.js";
import adminControllers from "../controllers/admin.controller.js";
import authorize from "../middleware/roles.js";

const router = express.Router();

router.get(
  "/tickets/:ticketId",
  auth,
  authorize("admin"),
  adminControllers.getTicketById,
);

router.get("/tickets", auth, authorize("admin"), adminControllers.allTickets);

router.get(
  "/event-revenue/:eventId",
  auth,
  authorize("admin"),
  adminControllers.getEventRevenueById,
);

router.get(
  "/event-revenue",
  auth,
  authorize("admin"),
  adminControllers.getEventsRevenue,
);


export default router;
