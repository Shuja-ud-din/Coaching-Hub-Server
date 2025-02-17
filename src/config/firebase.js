import admin from "firebase-admin";
import fsPromise from "fs/promises";
import ExpoToken from "../models/expoTokenModel.js";

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(await fsPromise.readFile("firebase_admin.json"))
  ),
});

export const sendFirebaseNotification = async ({
  userId,
  title,
  body,
  path,
}) => {
  const expoToken = await ExpoToken.findOne({ userId });

  if (!expoToken) {
    return console.log("No Expo Token found for this user");
  }

  const message = {
    notification: {
      title,
      body,
    },
    data: {
      path,
    },
  };

  admin
    .messaging()
    .send({ token: expoToken.expoPushToken, ...message })
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });

  return;
};
