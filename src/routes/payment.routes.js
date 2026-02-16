import express from "express";
import paymentController from "../controllers/payment.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/initialize", auth, paymentController.initializePayment);
router.get("/verify", paymentController.verifyPayment);
router.post("/webhook", paymentController.paystackWebhook);

export default router;
