import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      unique: true,
    },
    status: {
      type: String,
      enum: ["Valid", "Used", "Refunded", "Cancelled", "Used"],
      default: "Valid",
    },
  },
  { timestamps: true },
);

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
