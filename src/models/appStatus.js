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
});

const AppStatus = mongoose.model("AppStatus", schema);
export default AppStatus;
