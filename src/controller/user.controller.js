import { ApiError } from "../errors/ApiError.js";
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

const createNewUserHandler = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const user = await createUser({ name, email, phoneNumber, password });
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: user.user,
      token: user.token,
    });
  } catch (error) {
    next(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error"
      )
    );
  }
};

const loginUserHandler = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await loginUser({ phoneNumber, password });
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
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
    const { otp, phoneNumber } = req.body;
    const { user, token } = await verifyUser(otp, phoneNumber);

    res.status(200).json({
      success: true,
      message: "User Verified Successfully",
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error"
      )
    );
  }
};
const generateOTPHandler = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    const { userEmail, otp } = await generateOTP({ phoneNumber });

    await sendMail(userEmail, "OTP for Verification", otp, (err, data) => {
      if (err) {
        throw new ApiError(500, "Unable to send OTP");
      } else {
        res.json({
          success: true,
          message: "OTP Sent Successfully",
        });
      }
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
    const { phoneNumber } = req.body;

    const id = await forgetPassword({ phoneNumber });
    console.log(id);

    res.status(200).json({
      success: true,
      userId: id,
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
    const { otp, userId } = req.body;
    const { userId: IdOfUser, token } = await verifyForgetPasswordOTP({
      otp,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "OTP Verified Successfully",
      userId: IdOfUser,
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
    const { token, userId, password } = req.body;

    await resetPassword({ token, userId, password });

    res.status(200).json({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    next(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error"
      )
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
};
