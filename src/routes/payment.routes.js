const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middleware/auth");

router.post("/initialize", authMiddleware, paymentController.initializePayment);
router.get("/verify", paymentController.verifyPayment);
router.post("/webhook", paymentController.paystackWebhook);

module.exports = router;
