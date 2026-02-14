const Ticket = require("../models/ticket");
const TicketType = require("../models/tickettype");
const crypto = require("crypto");

exports.buyTicket = async (req, res) => {
  try {
    const { ticketTypeId } = req.body;

    const ticketType = await TicketType.findById(ticketTypeId);

    if (!ticketType) {
      return res.status(404).json({ message: "Ticket type not found" });
    }

    if (ticketType.sold >= ticketType.quantityLimit) {
      return res.status(400).json({ message: "Tickets sold out" });
    }

    const ticket = await Ticket.create({
      event: ticketType.event,
      ticketType: ticketType._id,
      owner: req.user.id,
      ticketCode: crypto.randomBytes(6).toString("hex"),
    });

    ticketType.sold += 1;
    await ticketType.save();

    res.status(201).json({
      message: "Ticket purchased successfully",
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

