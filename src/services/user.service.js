import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import { createSupportChat } from "./chat.service.js";
import { env } from "../config/env.js";
import sendMail from "../utils/sendMail.js";
import { sendNotificationToAdmin } from "../utils/sendNotification.js";
import Provider from "../models/providerModel.js";
import Admin from "../models/adminModel.js";
import CPToken from "../models/CPToken.js";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";

const createUser = async ({ name, email, phoneNumber, password }) => {
  const emailExists = await User.findOne({ email });
  const phNoExists = await User.findOne({ phoneNumber });

  if (emailExists || phNoExists) {
    throw new Error(
      `${emailExists ? "Email" : "Phone number"} already taken`,
      409
    );
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  const user = await User.create({
    name,
    email,
    password: encryptedPassword,
    phoneNumber,
    otp,
  });

  //create customer and associate with support
  const customer = await Customer.create({
    user: user._id,
  });
  const chat = await createSupportChat(user._id);
  customer.chat.push(chat._id);

  await customer.save();

  // generate jwt token
  const token = jsonwebtoken.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.JWT_SECRET
  );

  //send otp by email
  sendMail(email, "OTP for verification", otp, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });

  //Notify Admin
  sendNotificationToAdmin("New User Registered", `${name} has registered`);
  return {
    user: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      id: user.id,
      roleId: user.roleId,
    },
    token,
  };
};

const loginUser = async ({ phoneNumber, password }) => {
  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new Error("Invalid credentials", 400);
  }
  if (!user.isValid) {
    throw new Error(400, "User is not valid", 400);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new Error("Invalid credentials", 400);
  }

  const token = jsonwebtoken.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.JWT_SECRET
  );

  let roleUser = null;

  if (user.role === "Customer") {
    roleUser = await Customer.findOne({ user: user._id });
  } else if (user.role === "Provider") {
    roleUser = await Provider.findOne({ user: user._id });
  } else {
    roleUser = await Admin.findOne({ user: user._id });
  }

  return {
    user: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      roleId: roleUser?._id,
      role: user.role,
      id: user._id,
      balance: roleUser?.balance,
    },
    token,
  };
};

const verifyUser = async (otp, phoneNumber) => {
  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new Error("User Not Found", 400);
  }

  if (user.otp !== otp) {
    throw new Error("Invalid OTP", 400);
  }

  user.isValid = true;
  user.otp = null;
  await user.save();

  const token = jsonwebtoken.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  return {
    user,
    token,
  };
};

const generateOTP = async ({ phoneNumber }) => {
  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new Error("User Not Found", 400);
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  user.otp = otp;
  await user.save();

  return { userEmail: user.email, otp };
};

const forgetPassword = async ({ phoneNumber }) => {
  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new Error("User Not Found", 400);
  }

  if (user.role === "Admin") {
    throw new Error(
      "Admin Password Cannot be Reset. Contact Super Admin to Reset Your Password",
      500
    );
  }

  const tokenExists = await CPToken.findOne({ userId: user._id });
  if (tokenExists) {
    await CPToken.findByIdAndDelete(tokenExists._id);
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const token = crypto.randomBytes(16).toString("hex");
  const cpToken = await CPToken.create({
    userId: user._id,
    token,
    otp,
    expirationDate: new Date(Date.now() + 10 * 60 * 1000),
  });

  return await sendMail(
    user.email,
    "OTP for Verification",
    otp,
    (err, data) => {
      if (err) {
        throw new Error("Unable to send OTP", 500);
      } else {
        res.json({
          success: true,
          userId: user._id,
          message: "OTP Sent Successfully",
        });
      }
    }
  );
};

const verifyForgetPasswordOTP = async ({ otp, userId }) => {
  const cpToken = await CPToken.findOne({ userId });

  if (!cpToken) {
    throw new Error("OTP Not Found", 400);
  }
  if (cpToken.otp !== otp) {
    throw new Error("Invalid OTP", 400);
  }

  return { userId, token: cpToken.token };
};

const resetPassword = async ({ token, userId, password }) => {
  const cpToken = await CPToken.findOne({ token, userId });

  if (!cpToken) {
    throw new Error("Invalid Token", 400);
  }
  if (cpToken.expirationDate < new Date()) {
    throw new Error("Token Expired", 400);
  }
  if (token !== cpToken.token) {
    throw new Error("Invalid Token", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User Not Found", 400);
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  user.password = encryptedPassword;
  await user.save();

  await CPToken.findByIdAndDelete(cpToken._id);
};

export {
  createUser,
  loginUser,
  verifyUser,
  generateOTP,
  forgetPassword,
  verifyForgetPasswordOTP,
  resetPassword,
};
