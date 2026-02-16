import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
      },
    ],
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    reference: String,
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
