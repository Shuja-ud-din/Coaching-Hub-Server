import { ApiError } from "../errors/ApiError.js";
import { createUser, loginUser, verifyUser } from "../services/user.service.js";
import sendMail from "../utils/sendMail.js";

const createNewUser = async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const user = await createUser({ name, email, phoneNumber, password });
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
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

const loginPreviousUser = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await loginUser({ phoneNumber, password });
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user,
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
const userVerification = async (req, res, next) => {
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
const generateOTPForUser = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;

    // Call the service function to generate OTP
    const { userEmail, otp } = await generateOTP({ phoneNumber });

    // Send the OTP via email
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
    // Handle errors and send appropriate response
    next(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal server error"
      )
    );
  }
};
export {
  createNewUser,
  loginPreviousUser,
  userVerification,
  generateOTPForUser,
};
