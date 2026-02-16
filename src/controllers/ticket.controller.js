import Ticket from "../models/ticket.js";
import Event from "../models/event.js";
import crypto from "crypto";

const buyTicket = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      const error = new Error("Invalid event id");
      error.status = 403;
      return next(error);
    }

    if (event.ticketSold === event.ticketQuantityLimit) {
      const error = new Error("Ticket is sold out");
      error.status = 404;
      return next(error);
    }

    const ticket = new Ticket({
      event: event._id,
      price: event.ticketPrice,
      owner: req.user._id,
      ticketCode: crypto.randomBytes(6).toString("hex"),
    });

    try {
      await ticket.save();

      await event.updateOne({ $inc: { ticketSold: 1 } });

      res.status(201).json({
        success: true,
        message: "Ticket purchase successful",
        data: {
          ticket,
        },
      });
    } catch (err) {
      return next(`Ticket wasn't saved | ${err}`);
    }
  } catch (err) {
    next(err);
  }
};

export default { buyTicket };
