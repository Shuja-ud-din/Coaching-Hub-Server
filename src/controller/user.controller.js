import { ApiError } from "../errors/ApiError.js";
import User from "../models/userModel.js";
import {
  createUser,
  forgetPassword,
  generateOTP,
  loginUser,
  resetPassword,
  verifyForgetPasswordOTP,
  verifyUser,
} from "../services/user.service.js";
import sendMail from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

const createNewUserHandler = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const acceptLanguage =
      req.headers["Accept-Language"]?.split(",")[0] || "en";
    const timezone = req.headers["timezone"] || "UTC";

    await createUser({
      name,
      email,
      phoneNumber,
      password,
      timezone,
      language: acceptLanguage,
    });

    res.status(201).json({
      success: true,
      message: "OTP has been sent, Please check your email",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};

const loginUserHandler = async (req, res, next) => {
  try {
    const { email, phoneNumber, password, role } = req.body;
    const user = await loginUser({ email, phoneNumber, password, role });

    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      role: user.role,
      user: user.user,
      token: user.token,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};
const userVerificationHandler = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    const { user, token } = await verifyUser(otp, email);

    res.status(200).json({
      success: true,
      message: "User Logged in Successfully",
      token,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};

const generateOTPHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { userEmail, otp } = await generateOTP({ email });
    sendMail(
      {
        to: userEmail,
        subject: "OTP for Verification",
        text: `${otp}`,
      },
      (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      }
    );

    // await sendMail(userEmail, "OTP for Verification", otp, (err, data) => {
    //   if (err) {
    //     throw new ApiError(500, "Unable to send OTP");
    //   } else {
    //     res.json({
    //       success: true,
    //       message: "OTP Sent Successfully",
    //     });
    //   }
    // });

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};

const forgetPasswordHandler = async (req, res, next) => {
  try {
    const { email } = req.body;

    await forgetPassword({ email });

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};
const verifyForgetPasswordOTPHandler = async (req, res, next) => {
  try {
    const { otp, email } = req.body;
    const { token } = await verifyForgetPasswordOTP({
      otp,
      email,
    });

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
      token,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};

const resetPasswordHandler = async (req, res, next) => {
  try {
    const { password } = req.body;
    const token =
      req.header("authorization") && req.header("authorization").split(" ")[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    await resetPassword({
      userId,
      password,
    });

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};

const updateLanguageHandler = async (req, res) => {
  try {
    const { language } = req.body;
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    user.language = language;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Language updated successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};

const updateTimezoneHandler = async (req, res) => {
  try {
    const { timezone } = req.body;
    const { userId } = req.user;

    if (!timezone) {
      throw new ApiError(400, "Timezone is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User not found");
    }

    user.timezone = timezone;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Timezone updated successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal server error"
    );
  }
};
export {
  createNewUserHandler,
  loginUserHandler,
  userVerificationHandler,
  generateOTPHandler,
  forgetPasswordHandler,
  verifyForgetPasswordOTPHandler,
  resetPasswordHandler,
  updateLanguageHandler,
  updateTimezoneHandler,
};
