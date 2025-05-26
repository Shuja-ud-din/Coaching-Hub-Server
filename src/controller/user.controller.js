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
import { t } from "../utils/i18n.js";

const createNewUserHandler = async (req, res, next) => {
  const acceptLanguage = req.headers["Accept-Language"]?.split(",")[0] || "en";
  try {
    const { name, email, phoneNumber, password } = req.body;

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
      message: t("OTP_SENT_MESSAGE", acceptLanguage),
    });
  } catch (error) {
    console.log(error);

    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", acceptLanguage)
    );
  }
};

const loginUserHandler = async (req, res, next) => {
  const lang = req.language;
  try {
    const { email, phoneNumber, password, role } = req.body;
    const user = await loginUser({ email, phoneNumber, password, role, lang });

    res.status(200).json({
      success: true,
      message: t("LOGIN_SUCCESS", lang),
      role: user.role,
      user: user.user,
      token: user.token,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

const userVerificationHandler = async (req, res, next) => {
  const lang = req.language;
  try {
    const { otp, email } = req.body;
    const { user, token } = await verifyUser(otp, email, lang);

    res.status(200).json({
      success: true,
      message: t("USER_LOGGED_IN_SUCCESSFULLY", lang),
      token,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

const generateOTPHandler = async (req, res, next) => {
  try {
    const { email } = req.body;
    const lang = req.language;
    const { userEmail, otp } = await generateOTP({ email, lang });
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
      message: t("OTP_SENT_MESSAGE", lang),
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

const forgetPasswordHandler = async (req, res, next) => {
  const lang = req.language;
  try {
    const { email } = req.body;
    await forgetPassword({ email, lang });

    res.status(200).json({
      success: true,
      message: t("OTP_SENT_MESSAGE", lang),
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};
const verifyForgetPasswordOTPHandler = async (req, res) => {
  const lang = req.language;
  try {
    const { otp, email } = req.body;
    const { token } = await verifyForgetPasswordOTP({
      otp,
      email,
      lang,
    });

    res.status(200).json({
      success: true,
      message: t("OTP_VERIFIED_SUCCESSFULLY", lang),
      token,
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

const resetPasswordHandler = async (req, res) => {
  const lang = req.language;
  try {
    const { password } = req.body;
    const token =
      req.header("authorization") && req.header("authorization").split(" ")[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    await resetPassword({
      userId,
      password,
      lang,
    });

    res.status(200).json({
      success: true,
      message: t("PASSWORD_RESET_SUCCESSFULLY", lang),
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
    );
  }
};

const updateLanguageHandler = async (req, res) => {
  const { language } = req.body;
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, t("USER_NOT_FOUND", language));
    }

    user.language = language;
    await user.save();

    res.status(200).json({
      success: true,
      message: t("LANGUAGE_UPDATED_SUCCESSFULLY", language),
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", language)
    );
  }
};

const updateTimezoneHandler = async (req, res) => {
  try {
    const { timezone } = req.body;
    const { userId } = req.user;

    if (!timezone) {
      throw new ApiError(400, t("TIMEZONE_REQUIRED"));
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, t("USER_NOT_FOUND"));
    }

    user.timezone = timezone;
    await user.save();

    res.status(200).json({
      success: true,
      message: t("TIMEZONE_UPDATED_SUCCESSFULLY", lang),
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || t("INTERNAL_SERVER_ERROR", lang)
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
