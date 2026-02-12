import express from "express";
import cors from "cors";
import "dotenv/config";
import startServer from "./server.js";
import eventRoutes from "./routes/event.routes.js";
import error from "./middleware/error.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger

//Routes
app.use("/api/event", eventRoutes);
app.use("/api/auth", authRoutes);

//Error Handler
app.use(error);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

startServer(app, PORT);
