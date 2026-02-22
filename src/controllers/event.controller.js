import mongoose from "mongoose";
import Event from "../models/event.js";

const createEvent = async (req, res, next) => {
  try {
    const { title, desc, date, venue, ticketPrice, ticketQuantityLimit } =
      req.body;

    if (
      !title ||
      !desc ||
      !date ||
      !venue ||
      !ticketPrice ||
      !ticketQuantityLimit
    ) {
      const error = new Error("All fields are required");
      error.status = 400;
      return next(error);
    }

    const event = new Event({
      title,
      desc,
      date,
      venue,
      owner: req.user._id,
      ticketPrice,
      ticketQuantityLimit,
    });

    await event.save();
    await event.populate("owner", "name email");

    res.status(201).json({
      success: true,
      message: "User successfully created",
      data: {
        event,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const events = await Event.find().limit(10);
    if (events.length < 1) {
      const error = new Error("No events found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        events,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      const error = new Error("Invalid event id");
      error.status = 400;
      return next(error);
    }

    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        event,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      const error = new Error("Invalid event id");
      error.status = 400;
      return next(error);
    }

    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      return next(error);
    }

    if (
      req.user.role !== "admin" &&
      event.owner.toString() !== req.user._id.toString()
    ) {
      const error = new Error("You are not allowed to edit this event");
      error.status = 403;
      return next(error);
    }

    const { title, desc, date, venue, ticketPrice, ticketQuantityLimit } =
      req.body;

    const filters = {};
    if (title) filters.title = title;
    if (desc) filters.desc = desc;
    if (date) filters.date = date;
    if (venue) filters.venue = venue;
    if (ticketPrice) filters.ticketPrice = ticketPrice;
    if (ticketQuantityLimit) filters.ticketQuantityLimit = ticketQuantityLimit;

    const updatedEvent = await Event.findByIdAndUpdate(
      { _id: eventId },
      filters,
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: {
        updatedEvent,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    const action = req.params.action;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      const error = new Error("Invalid event id");
      error.status = 400;
      return next(error);
    }

    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      return next(error);
    }

    if (
      req.user.role !== "admin" &&
      event.owner.toString() !== req.user._id.toString()
    ) {
      const error = new Error("You are not allowed to edit this event");
      error.status = 403;
      return next(error);
    }

    if (action !== "publish" && action !== "cancel") {
      const error = new Error("Invalid action");
      error.status = 400;
      return next(error);
    }

    let updatedEvent;

    switch (action) {
      case "publish":
        updatedEvent = await Event.findByIdAndUpdate(
          { _id: eventId },
          { status: "published" },
          { new: true },
        );
        break;
      case "cancel":
        updatedEvent = await Event.findByIdAndUpdate(
          { _id: eventId },
          { status: "cancelled" },
          { new: true },
        );
        break;

      default:
        const error = new Error("Invalid action");
        error.status = 400;
        return next(error);
    }

    res.status(200).json({
      success: true,
      message: `Event ${action} successful`,
      data: {
        updatedEvent,
      },
    });
  } catch (err) {
    next(err);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const eventId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      const error = new Error("Invalid event id");
      error.status = 400;
      return next(error);
    }

    const event = await Event.findById(eventId);

    if (!event) {
      const error = new Error("Event not found");
      error.status = 404;
      return next(error);
    }

    if (
      req.user.role !== "admin" &&
      event.owner.toString() !== req.user._id.toString()
    ) {
      const error = new Error("You are not allowed to edit this event");
      error.status = 403;
      return next(error);
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      const error = new Error("Event not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
export default {
  createEvent,
  getEvent,
  getEventById,
  updateEvent,
  updateStatus,
  deleteEvent,
};
