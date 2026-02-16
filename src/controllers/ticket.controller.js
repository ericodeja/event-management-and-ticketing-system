import Ticket from "../models/ticket.js";
import Event from "../models/event.js";
import crypto from "crypto";
import mongoose from "mongoose";

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

    const code = crypto.randomBytes(6).toString("hex");

    const ticket = new Ticket({
      event: event._id,
      price: event.ticketPrice,
      owner: req.user._id,
      code: code,
    });

    try {
      await ticket.save();

      await ticket.populate("event", "title venue");
      await ticket.populate("owner", "name email");

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

const verifyTicket = async (req, res, next) => {
  try {
    const { ticketId, ticketEvent, ticketPrice, ticketOwner, ticketCode } =
      req.body;

    if (
      ticketId == null ||
      ticketEvent == null ||
      ticketPrice == null ||
      ticketOwner == null ||
      ticketCode == null
    ) {
      const error = new Error("All fields are required");
      error.status = 400;
      return next(error);
    }

    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
      const error = new Error("Invalid Ticket | Invalid ticket id");
      error.status = 400;
      return next(error);
    }

    const ticket = await Ticket.findById(ticketId)
      .populate("event")
      .populate("owner");

    if (!ticket) {
      const error = new Error("Invalid Ticket | Ticket doesn't exist");
      error.status = 400;
      return next(error);
    }

    if (ticket.status !== "Valid") {
      const error = new Error("Invalid Ticket | Ticket is not valid");
      error.status = 400;
      return next(error);
    }

    if (
      ticket.event.title !== String(ticketEvent) ||
      ticket.price !== Number(ticketPrice) ||
      ticket.owner.name !== String(ticketOwner) ||
      ticket.code !== String(ticketCode)
    ) {
      const error = new Error("Invalid Ticket | Ticket info doesn't match");
      error.status = 400;
      return next(error);
    }

    await ticket.updateOne({ status: "Used" });

    res.status(200).json({
      success: true,
      message: "Ticket is valid",
    });
  } catch (err) {
    next(err);
  }
};

export default { buyTicket, verifyTicket };
