import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled"],
      default: "draft",
    },
    ticketPrice: {
      type: Number,
      required: true,
    },
    ticketQuantityLimit: {
      type: Number,
      required: true,
    },
    ticketSold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
