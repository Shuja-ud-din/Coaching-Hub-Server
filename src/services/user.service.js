import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import { createSupportChat } from "./chat.service.js";
import { env } from "../config/env.js";
import sendMail from "../utils/sendMail.js";
import { sendNotificationToAdmin } from "../utils/sendNotification.js";
import { ApiError } from "../errors/ApiError.js";
import Provider from "../models/providerModel.js";
import Admin from "../models/adminModel.js";
const createUser = async ({ name, email, phoneNumber, password }) => {
  const emailExists = await User.findOne({ email });
  const phNoExists = await User.findOne({ phoneNumber });

  if (emailExists || phNoExists) {
    throw new ApiError(
      409,
      `${emailExists ? "Email" : "Phone number"} already taken`
    );
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
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
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      id: user.id,
      roleId: user.roleId,
      token,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while creating the user",
      false,
      error.stack
    );
  }
};

const loginUser = async ({ phoneNumber, password }) => {
  const user = await User.findOne({ phoneNumber });

  if (!user) {
    throw new ApiError(400, "Invalid credentials");
  }
  if (!user.isValid) {
    throw new ApiError(400, "User is not valid");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new ApiError(400, "Invalid credentials");
  }

  const token = jsonwebtoken.sign(
    {
      user: user._id,
      role: user.role,
    },
    env.JWT_SECRET
  );

  const roleUser = null;

  if (user.role === "Customer") {
    roleUser = await Customer.findOne({ user: user._id });
  } else if (user.role === "Provider") {
    roleUser = await Provider.findOne({ user: user._id });
  } else {
    roleUser = await Admin.findOne({ user: user._id });
  }

  return {
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
    roleId: roleUser?._id,
    role: user.role,
    id: user._id,
    balance: roleUser?.balance,
    token,
  };
};
export { createUser, loginUser };
