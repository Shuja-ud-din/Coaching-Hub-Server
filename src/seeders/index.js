import mongoose from "mongoose";
import { env } from "../config/env.js";
import { seedAdmins } from "./admin/adminSeeder.js";
import { seedAppData } from "./app/appSeeder.js";

const { MONGO_URL } = env;

const seedDatabase = async () => {
  mongoose
    .connect(MONGO_URL)
    .then(async () => {
      console.log("Connected to Mongo DB");

      // await seedAdmins();
      await seedAppData();
    })
    .catch((err) => {
      console.log("Something went wrong while seeding"), JSON.stringify(err);
    })
    .finally(() => {
      mongoose.connection.close();
      console.log("Connection Closed");
    });
};

seedDatabase();
