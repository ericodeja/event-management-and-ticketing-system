import express from "express";
import eventControllers from "../controllers/eventController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create-event", auth, eventControllers.createEvent);

router.get("/all-events", auth, eventControllers.getEvent);

router.get("/:id", auth, eventControllers.getEventById);

router.put("/:id", auth, eventControllers.updateEvent);

router.put("/:id/:action", auth, eventControllers.publishEvent);

router.delete("/:id", auth, eventControllers.deleteEvent);

export default router;
