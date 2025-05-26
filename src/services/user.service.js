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
import { ApiError } from "../errors/ApiError.js";
import { t } from "../utils/i18n.js";

const createUser = async ({
  name,
  email,
  phoneNumber,
  address,
  password,
  speciality,
  experience,
  language,
  timezone,
  about,
  workingDays,
  workingTimes,
  profilePicture,
  swarmLink,
  sessionDuration,
  sessionPrice,
  countryOfResidence,
  nationality,
  degreeName,
  institute,
  yearOfPassingDegree,
  role = "coachee",
}) => {
  let emailExists = await User.findOne({ email });
  let phNoExists = await User.findOne({ phoneNumber });

  const encryptedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  let user = null;

  if (phNoExists) {
    emailExists = phNoExists;
  }

  if (emailExists || phNoExists) {
    emailExists.name = name;
    emailExists.email = email;
    emailExists.phoneNumber = phoneNumber;
    emailExists.language = language;
    emailExists.timezone = timezone;
    emailExists.password = encryptedPassword;
    emailExists.otp = otp;
    await emailExists.save();

    if (emailExists.role === "coachee") {
      const customer = await Customer.findOne({ user: emailExists._id });
      await customer.deleteOne();
    } else {
      const provider = await Provider.findOne({ user: emailExists._id });
      await provider.deleteOne();
    }

    user = emailExists;
  } else {
    user = await User.create({
      name,
      email,
      password: encryptedPassword,
      phoneNumber,
      otp,
      role,
      language,
      timezone,
    });
  }

  // generate jwt token
  const token = jsonwebtoken.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.JWT_SECRET
  );

  //send otp by email
  sendMail(
    {
      to: email,
      subject: "OTP for Verification",
      text: `Your OTP is ${otp}`,
    },
    (err, data) => {
      if (err) {
        console.log(err);
        throw new Error("Unable to send OTP", 500);
      } else {
        console.log("successfully send otp");
      }
    }
  );

  //Notify Admin
  sendNotificationToAdmin("New User Registered", `${name} has registered`);
  if (role === "coach") {
    const provider = await Provider.create({
      user: user._id,
      speciality,
      experience,
      about,
      workingDays,
      workingTimes,
      profilePicture,
      swarmLink,
      sessionDuration,
      address,
      sessionPrice,
      countryOfResidence,
      nationality,
      degreeName,
      institute,
      yearOfPassingDegree,
    });

    return provider;
  } else {
    const customer = await Customer.create({
      user: user._id,
    });
    return {
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        id: user._id,
        roleId: customer._id,
      },
      token,
    };
  }
};

const loginUser = async ({ email, phoneNumber, password, role, lang }) => {
  const user = await User.findOne({
    $or: [{ email }, { phoneNumber }],
    role: role,
  });

  if (!user) {
    throw new ApiError(400, t("INVALID_CREDENTIALS", lang));
  }

  if (!user.isValid) {
    throw new ApiError(400, t("ACCOUNT_PENDING_APPROVAL", lang));
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    throw new ApiError(400, t("INVALID_CREDENTIALS", lang));
  }

  const token = jsonwebtoken.sign(
    {
      userId: user._id,
      role: user.role,
    },
    env.JWT_SECRET
  );

  let roleUser = null;

  if (user.role === "coachee") {
    roleUser = await Customer.findOne({ user: user._id });
  } else if (user.role === "coach") {
    roleUser = await Provider.findOne({ user: user._id });
    if (roleUser.status === "Pending") {
      throw new ApiError(400, t("ACCOUNT_PENDING_APPROVAL", lang));
    } else if (roleUser.status === "Blocked") {
      throw new ApiError(400, t("ACCOUNT_BLOCKED", lang));
    }
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

const verifyUser = async (otp, email, lang) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, t("USER_NOT_FOUND", lang));
  }

  if (user.otp !== otp) {
    console.log(user.otp, otp);
    throw new ApiError(400, t("INVALID_OTP", lang));
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

const generateOTP = async ({ email, lang }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, t("USER_NOT_FOUND", lang));
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  user.otp = otp;
  await user.save();

  return { userEmail: user.email, otp };
};

const forgetPassword = async ({ email, lang }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, t("USER_NOT_FOUND", lang));
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

  await CPToken.create({
    userId: user._id,
    otp,
    expirationDate: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  await sendMail(
    {
      to: user.email,
      subject: "OTP for Verification",
      text: `You forget password otp is successfully sent to your credentials, ${otp}. This OTP will expire in 10 minutes.`,
    },
    (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
      }
    }
  );
  // await sendMail(user.email, "OTP for Verification", otp, (err, data) => {
  //   if (err) {
  //     throw new Error("Unable to send OTP", 500);
  //   } else {
  //     console.log("successfully send otp");
  //   }
  // });
  return user._id.toString();
};

const verifyForgetPasswordOTP = async ({ otp, email, lang }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, t("USER_NOT_FOUND", lang));
  }

  const cpToken = await CPToken.findOne({ userId: user._id });
  if (!cpToken) {
    throw new ApiError(400, t("INVALID_OTP", lang));
  }
  if (cpToken.otp !== otp) {
    throw new ApiError(400, t("INVALID_OTP", lang));
  }
  if (cpToken.expirationDate < new Date()) {
    throw new ApiError(400, t("OTP_EXPIRED", lang));
  }

  const token = jsonwebtoken.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );

  return { userId: user._id, token };
};

const resetPassword = async ({ userId, password, lang }) => {
  const cpToken = await CPToken.findOne({ userId });

  if (!cpToken) {
    throw new ApiError(400, t("INVALID_TOKEN", lang));
  }
  if (cpToken.expirationDate < new Date()) {
    throw new ApiError(400, t("TOKEN_EXPIRED", lang));
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, t("USER_NOT_FOUND", lang));
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
