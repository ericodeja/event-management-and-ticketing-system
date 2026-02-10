import express from "express";
import cors from "cors";
import "dotenv/config";
import startServer from "./server.js";
import errorHandler from "../middleware/error.js";
import eventRoutes from "../routes/event.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger

//Routes
app.use("/api/event", eventRoutes);

//Error Handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

startServer(app, PORT);
