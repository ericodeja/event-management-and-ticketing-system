import express from "express";
import cors from 'cors'
import "dotenv/config";
import startServer from "./server.js";
import errorHandler from "../middleware/error.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//Logger


//Routes


//Error Handler
app.use(errorHandler)


app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

startServer(app, PORT);

