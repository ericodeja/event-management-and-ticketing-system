import axios from "axios";
import Order from "../models/Order.js";

/**
 * 1️⃣ Initialize Payment
 */
const initializePayment = async (req, res) => {
  try {
    const { eventId, tickets, amount } = req.body;

    const reference =
      "ORDER_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    const order = await Order.create({
      user: req.user.id,
      event: eventId,
      tickets,
      amount,
      reference,
      status: "pending",
    });

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: amount * 100,
        reference,
        callback_url: "http://localhost:5000/payment/verify",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Payment initialized",
      paymentUrl: response.data.data.authorization_url,
      reference,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Payment initialization failed",
    });
  }
};

/**
 * 2️⃣ Verify Payment
 */
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      }
    );

    const paystackData = response.data.data;

    if (paystackData.status === "success") {
      await Order.findOneAndUpdate(
        { reference },
        { status: "paid" }
      );

      return res.status(200).json({
        message: "Payment successful",
      });
    } else {
      await Order.findOneAndUpdate(
        { reference },
        { status: "failed" }
      );

      return res.status(400).json({
        message: "Payment failed",
      });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Verification failed",
    });
  }
};

/**
 * 3️⃣ Webhook
 */
const paystackWebhook = async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      await Order.findOneAndUpdate(
        { reference },
        { status: "paid" }
      );
    }

    res.sendStatus(200);

  } catch (error) {
    console.error(error.message);
    res.sendStatus(500);
  }
};

export default {
  initializePayment,
  verifyPayment,
  paystackWebhook,
};
