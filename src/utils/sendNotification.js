import Notification from "../models/notificationModel.js";
import { connectedUsers } from "../socket/socket.js";
export const sendNotificationToAdmin = async (title, message) => {
  const superAdmin = await User.findOne({ role: "Super Admin" });

  const notification = await Notification.create({
    title,
    message,
    user: superAdmin._id,
  });

  const unreadNotifications = await Notification.countDocuments({
    user: superAdmin._id,
    isRead: false,
  });

  const receivers = connectedUsers.filter(
    (user) => user.role === "Admin" || user.role === "Super Admin"
  );

  if (receivers.length > 0) {
    for (let receiver of receivers) {
      io.to(receiver.socketId).emit("notification", {
        unreadNotifications,

        notification: {
          id: notification._id,
          title: notification.title,
          message: notification.message,
          isRead: notification.isRead,
          createdAt: notification.createdAt,
        },
      });
    }
  }
};
