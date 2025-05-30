import express from "express";
import routes from "./routes/routes.js";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/ConnectDB.js";
import "./config/env.js";
import languageMiddleware from "./middlewares/language.js";

const app = express();

app.use(express.static("public"));

connectDB();

app.use(express.json());

app.use(languageMiddleware);

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors("*"));

app.get("/health", (req, res) => {
  res.status(200).send("Server is running");
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the server");
});

app.use("/api", routes);

export default app;
