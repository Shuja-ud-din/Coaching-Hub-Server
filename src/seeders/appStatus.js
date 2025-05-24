import AppStatus from "../models/appStatus.js";

export const seedAppStatus = async () => {
  console.log("Seeding App Status...");

  await AppStatus.create({
    version: "1.0.0",
    iosVersion: "1.0.0",
    androidVersion: "1.0.0",
  });

  console.log("App Status Seeded Successfully");
};
