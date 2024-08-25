import Joi from "joi";
import mongoose from "mongoose";

const schema = mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    default: "Support",
  },
  messages: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
    default: [],
  },
  unread: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Chat = mongoose.model("Chat", schema);

const createChatBody = Joi.object({
  user2: Joi.string().required(),
});

export default Chat;
export { createChatBody };
