import httpStatus from "http-status";
import { ApiError } from "../errors/ApiError.js";
import Admin from "../models/adminModel.js";
import Chat from "../models/chatModel.js";
import User from "../models/userModel.js";
import { connectedUsers } from "../socket/socket.js";

export const getAllChats = async (req, res) => {
  const { user } = req;

  try {
    const chats = await Chat.find({
      $or: [{ user1: user.userId }, { user2: user.userId }],
    })
      .populate("user1")
      .populate("user2")
      .populate({
        path: "messages",
        populate: {
          path: "sender",
        },
      });

    const data = chats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1];

      let receiver = null;
      let sender = null;

      if (chat.user1._id.toString() === user.userId) {
        receiver = chat.user2;
        sender = chat.user1;
      } else {
        receiver = chat.user1;
        sender = chat.user2;
      }

      const unreadMsgs = chat.messages.filter((message) => {
        return message.isRead === false && message.sender._id != user.userId;
      });

      return {
        id: chat._id,
        user: {
          id: receiver._id,
          name: receiver.name,
          profilePicture: receiver.profilePicture,
          role: receiver.role,
        },
        createdAt: chat.createdAt,
        lastMessage: lastMessage
          ? {
              message: lastMessage.message,
              date: lastMessage.date,
            }
          : null,
        type: chat.type,
        unread: unreadMsgs.length,
      };
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (e) {
    console.log(e);
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

export const createChat = async (req, res) => {
  const { user } = req;
  const { user2 } = req.body;

  const adminUser = await Admin.findOne({ _id: user2 });

  try {
    const chat = await Chat.create({
      user1: user.userId,
      user2: adminUser.user,
    });

    res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

export const createSupportChat = async (userId) => {
  const superAdmin = await User.findOne({ role: "Super Admin" });

  try {
    const chat = await Chat.create({
      user1: superAdmin._id,
      user2: userId,
      type: "Support",
    });

    return chat;
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

export const getSupportChats = async (req, res) => {
  try {
    const chats = await Chat.find({ type: "Support" })
      .populate("user1")
      .populate("user2")
      .populate({
        path: "messages",
        populate: {
          path: "sender",
        },
      });

    const data = chats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      const unreadMsgs = chat.messages.filter(
        (message) =>
          message.isRead === false && message.sender.role !== "Super Admin"
      );

      return {
        id: chat._id,
        user: {
          id: chat.user2._id,
          name: chat.user2.name,
          profilePicture: chat.user2.profilePicture,
          role: chat.user2.role,
        },
        createdAt: chat.createdAt,
        unread: unreadMsgs.length,
        lastMessage: lastMessage
          ? {
              message: lastMessage.message,
              date: lastMessage.date,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (e) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};

export const getOnlineUsers = (req, res) => {
  res.status(200).json({
    success: true,
    data: connectedUsers,
  });
};

export const getAppointmentChats = async (req, res) => {
  try {
    const chats = await Chat.find({ type: "Appointment" })
      .populate("user1")
      .populate("user2")
      .populate({
        path: "messages",
        populate: {
          path: "sender",
        },
      });

    const data = chats.map((chat) => {
      const lastMessage = chat.messages[chat.messages.length - 1];
      const unreadMsgs = chat.messages.filter(
        (message) =>
          message.isRead === false && message.sender.role !== "Super Admin"
      );

      return {
        id: chat._id,
        user1: {
          id: chat.user1._id,
          name: chat.user1.name,
          profilePicture: chat.user1.profilePicture,
          role: chat.user1.role,
        },
        user2: {
          id: chat.user2._id,
          name: chat.user2.name,
          profilePicture: chat.user2.profilePicture,
          role: chat.user2.role,
        },
        createdAt: chat.createdAt,
        unread: unreadMsgs.length,
        lastMessage: lastMessage
          ? {
              message: lastMessage.message,
              date: lastMessage.date,
            }
          : null,
      };
    });

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, e.message);
  }
};
