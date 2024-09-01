import { addAdmin } from "../../services/admin.service.js";
import { adminData } from "./data.js";

export const seedAdmins = async () => {
  console.log("Seeding Admins...");

  await Promise.all(
    adminData.map(async (user) => {
      try {
        await addAdmin(user);
      } catch (err) {
        console.log("Error while seeding Admins: ", err);
      }
    })
  );

  console.log("Admins Seeded Successfully");
};
