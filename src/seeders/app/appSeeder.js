import App from "../../models/appStatus.js";

export const seedAppData = async () => {
  console.log("Seeding App Data...");

  await App.findOneAndUpdate(
    {},
    {
      version: "1.0.0",
      iosVersion: "1.0.0",
      androidVersion: "1.0.0",
      timezones: ["Africa/Cairo", "America/New York"],
      languages: [{ name: "English" }, { name: "Arabic" }],
      countries: [
        { name: "United Arab Emirates" },
        {
          name: "Egypt",
        },
      ],
      cities: [{ name: "Dubai" }, { name: "Cairo" }],
      jobTitles: ["Senior Manager", "Project Manager"],
      categories: [
        { name: "Life Coach" },
        { name: "Career Coach" },
        { name: "Relationship Coach" },
        { name: "Parenting Coach" },
        { name: "Health Coach" },
        { name: "Business Coach" },
      ],
    },
    { new: true, upsert: true }
  );

  console.log("App Data Seeded Successfully");
};
