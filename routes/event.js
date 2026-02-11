import express from "express";
import eventControllers from "../controllers/eventController.js";

const router = express.Router();

router.post("/create-event", eventControllers.createEvent);

router.get("/all-events", eventControllers.getEvent);

router.get("/:id", eventControllers.getEventById);

router.put("/:id", eventControllers.updateEvent);

router.put("/:id/:action", eventControllers.publishEvent);

router.delete("/:id", eventControllers.deleteEvent);

export default router;
