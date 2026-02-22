import Ticket from "../models/ticket.js";
import Event from "../models/event.js";
import mongoose from "mongoose";

const allTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find()
      .limit(10)
      .populate("event", "title date venue")
      .populate("owner", "name email");

    if (tickets.length < 1) {
      return res.status(200).json({
        success: true,
        message: "No tickets have been sold",
        data: {
          tickets,
        },
      });
    }

    const totalPages = await Ticket.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        pages: Math.ceil(totalPages / 10),
        tickets,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const ticketId = req.params.ticketId;

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      const error = new Error("Invalid ticket id");
      error.status = 400;
      return next(error);
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("event", "title date venue")
      .populate("owner", "name email");

    if (!ticket) {
      const error = new Error("Ticket not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: {
        ticket,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getEventRevenueById = async (req, res, next) => {
  try {
    const eventId = req.params.eventId;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      const error = new Error("Invalid event id");
      error.status = 400;
      return next(error);
    }

    const event = await Event.findById(eventId).select(
      "title ticketPrice ticketSold",
    );

    if (!event) {
      const error = new Error(`Event with id ${eventId} doesn't exist`);
      error.status = 404;
      return next(error);
    }

    const eventRevenue = event.ticketSold * event.ticketPrice;

    res.status(200).json({
      success: true,
      data: {
        [event.title]: eventRevenue,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getEventsRevenue = async (req, res, next) => {
  try {
    const events = await Event.find().select("title ticketPrice ticketSold");

    if (events.length < 1) {
      return res.json({
        success: true,
        message: "You have no saved event",
      });
    }

    const results = events.map((event) => {
      return {
        [event.title]: event.ticketPrice * event.ticketSold,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        results,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default {
  allTickets,
  getTicketById,
  getEventRevenueById,
  getEventsRevenue,
};
