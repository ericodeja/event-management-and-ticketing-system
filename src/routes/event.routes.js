import express from "express";
import eventControllers from "../controllers/event.controller.js";
import auth from "../middleware/auth.js";
import authorize from "../middleware/roles.js";

const router = express.Router();

router.post(
  "/create-event",
  auth,
  authorize("organizer"),
  eventControllers.createEvent,
);

router.get("/all-events", auth, eventControllers.getEvent);

router.get("/:id", auth, authorize("admin"), eventControllers.getEventById);

router.put(
  "/:id",
  auth,
  authorize("admin", "organizer"),
  eventControllers.updateEvent,
);

router.put(
  "/:id/:action",
  auth,
  authorize("admin", "organizer"),
  eventControllers.updateStatus,
);

router.delete(
  "/:id",
  auth,
  authorize("admin", "organizer"),
  eventControllers.deleteEvent,
);

export default router;
