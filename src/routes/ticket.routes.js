const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");
const authMiddleware = require("../middleware/auth"); // adjust if different

router.post("/buy", authMiddleware, ticketController.buyTicket);

module.exports = router;
