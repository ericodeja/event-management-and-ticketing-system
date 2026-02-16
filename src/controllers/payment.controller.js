import axios from "axios";
import Order from "../models/order.js";


const initializePayment = async (req, res, next) => {
  try {
    const { eventId, tickets, amount } = req.body;

    const reference =
      "ORDER_" + Date.now() + "_" + Math.floor(Math.random() * 1000);

    const order = new Order({
      user: req.user._id,
      event: eventId,
      tickets,
      amount,
      reference,
    });

    await order.save();

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: amount * 100,
        channels: ['card', 'bank_transfer'],
        reference: reference,
        callback_url: "http://localhost:5000/payment/verify",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.status(200).json({
      message: "Payment initialized",
      paymentUrl: response.data.authorization_url,
      reference: reference,
    });
  } catch (error) {
    const err = new Error(`Payment initialization failed || ${error}`);
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.query;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
        },
      },
    );

    const paystackData = response.data;

    if (paystackData.status === true) {
      await Order.findOneAndUpdate({ reference }, { status: "paid" });

      return res.status(200).json({
        message: "Payment successful",
      });
    } else {
      await Order.findOneAndUpdate({ reference }, { status: "failed" });

      const error = new Error("Payment failed");
      error.status = 400;
      return next(error);
    }
  } catch (error) {
    const err = new Error(`Verification failed|| ${error}`);
    next(err);
  }
};


const paystackWebhook = async (req, res, next) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const reference = event.data.reference;

      await Order.findOneAndUpdate({ reference }, { status: "paid" });
    }

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export default { initializePayment, verifyPayment, paystackWebhook };
