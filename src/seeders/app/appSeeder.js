import App from "../../models/appStatus.js";
import { TIMEZONES, CATEGORIES, LANGUAGES, JOBTITLES } from "./appData.js";
export const seedAppData = async () => {
  console.log("Seeding App Data...");

  await App.findOneAndUpdate(
    {},
    {
      version: "1.0.0",
      iosVersion: "1.0.0",
      androidVersion: "1.0.0",
      timezones: TIMEZONES,
      languages: LANGUAGES,
      countries: [
        {
          name: {
            en: "United Arab Emirates",
            ar: "الإمارة العربية المتحدة",
          },
        },
        {
          name: {
            en: "Egypt",
            ar: "مصر",
          },
        },
      ],
      cities: [
        {
          name: {
            en: "Dubai",
            ar: "دبي",
          },
        },
        {
          name: {
            en: "Cairo",
            ar: "القاهرة",
          },
        },
      ],
      jobTitles: JOBTITLES,
      categories: CATEGORIES,
    },
    { new: true, upsert: true }
  );

  console.log("App Data Seeded Successfully");
};
