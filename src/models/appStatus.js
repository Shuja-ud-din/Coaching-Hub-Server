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
    default: ["Africa/Cairo", "America/New York"],
  },
  languages: {
    type: [
      {
        name: {
          type: String,
        },
      },
    ],
    default: [
      { id: "1", name: "English" },
      { id: "2", name: "Arabic" },
    ],
  },
  countries: {
    type: [
      {
        name: { type: String },
      },
    ],
    default: [{ name: "United Arab Emirates" }],
  },
  cities: {
    type: [
      {
        name: { type: String },
      },
    ],
    default: [{ name: "Dubai" }],
  },
  jobTitles: {
    type: [String],
    default: ["Senior Manager", "Project Manager"],
  },
  categories: {
    type: [
      {
        name: { type: String },
      },
    ],
    default: [{ name: "Life Coach" }, { name: "Career Coach" }],
  },
});

const App = mongoose.model("App", schema);
export default App;
