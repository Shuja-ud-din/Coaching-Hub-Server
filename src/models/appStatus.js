import mongoose from "mongoose";

const schema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['active', 'inActive'],
    required: true,
    default: 'active',
  },
});

const AppStatus = mongoose.model('AppStatus', schema);
export default AppStatus;
