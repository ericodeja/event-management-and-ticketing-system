import express from "express";
import eventControllers from "../controllers/eventController.js";

const router = express.Router();

router.post("/create-event", eventControllers.createEvent);

export default router;
