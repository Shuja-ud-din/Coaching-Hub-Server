import express from "express";
import routes from "./routes/routes.js";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./config/ConnectDB.js";

const app = express();

connectDB();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(cors());

app.use("/api", routes);

export default app;
