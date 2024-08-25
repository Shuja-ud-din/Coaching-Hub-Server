import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import { createSupportChat } from "./chat.service.js";
import { env } from "../config/env.js";
import sendMail from "../utils/sendMail.js";
const createUser = async ({ name, email, phoneNumber, password }) => {
  const emailExists = await User.findOne({ email });
  const phNoExists = await User.findOne({ phoneNumber });

  if (emailExists || phNoExists) {
    return {
      success: false,
      status: 201,
      message: `${emailExists ? "email" : "phone number"} already taken`,
    };
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

    const customer = await Customer.create({
      user: user._id,
    });
    const chat = await createSupportChat(user._id);
    customer.chat.push(chat._id);

    await customer.save();

    const token = jsonwebtoken.sign(
      {
        userId: user._id,
        role: user.role,
      },
      env.JWT_SECRET
    );

    sendMail(email, "OTP for verification", otp, (error, data) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent");
      }
    });
  } catch (error) {}
};
