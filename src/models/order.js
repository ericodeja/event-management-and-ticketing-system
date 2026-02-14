const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  tickets: [
    {
      ticketType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TicketType",
      },
      quantity: Number,
    },
  ],
  amount: Number,
  reference: String,
  status: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
