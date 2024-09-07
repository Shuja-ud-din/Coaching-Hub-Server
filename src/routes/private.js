import express from "express";
import { catchAsync } from "../utils/catchAsync.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const privateRoutes = express.Router();

privateRoutes.get(
  "/flushDB",
  catchAsync(async (req, res) => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    const promises = collections.map(
      async (collection) => await db.collection(collection.name).drop()
    );

    await Promise.all(promises);

    const password = await bcrypt.hash("SuperAdmin1122", 10);

    await User.create({
      name: "Super Admin",
      email: "superadmin.dev@gmail.com",
      password: password,
      role: "Super Admin",
      isValid: true,
      phoneNumber: "03123456789",
    });

    res.status(200).json({
      success: true,
      message: "Database Flushed Successfully",
    });
  })
);

privateRoutes.get(
  "/shutDownServer",
  catchAsync(async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is shutting down",
    });
    process.exit();
  })
);

export { privateRoutes };
