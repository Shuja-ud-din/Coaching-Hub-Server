import mongoose from "mongoose";

const schema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["active", "inActive"],
    required: true,
    default: "active",
  },
  version: {
    type: String,
    default: "1.0.0",
  },
  iosVersion: {
    type: String,
    default: "1.0.0",
  },
  androidVersion: {
    type: String,
    default: "1.0.0",
  },
  timezones: {
    type: [String],
    default: [],
  },

  languages: {
    type: [
      {
        name: {
          en: { type: String },
          ar: { type: String },
        },
      },
    ],
    default: [
      { name: { en: "English", ar: "الإنجليزية" } },
      { name: { en: "Arabic", ar: "العربية" } },
    ],
  },
  countries: {
    type: [
      {
        name: { en: { type: String }, ar: { type: String } },
      },
    ],
    default: [
      { name: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" } },
    ],
  },
  cities: {
    type: [
      {
        name: { en: { type: String }, ar: { type: String } },
      },
    ],
    default: [{ name: { en: "Dubai", ar: "دبي" } }],
  },
  jobTitles: {
    type: [{ name: { en: { type: String }, ar: { type: String } } }],
    default: [
      {
        name: { en: "Senior Manage", ar: "مدير أول" },
        name: { en: "Project Manager", ar: "مدير مشروع" },
      },
    ],
  },
  categories: {
    type: [
      {
        name: { en: { type: String }, ar: { type: String } },
      },
    ],
    default: [],
  },
});

const App = mongoose.model("App", schema);
export default App;
