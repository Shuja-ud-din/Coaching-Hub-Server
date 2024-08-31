import { ApiError } from "../errors/ApiError.js";
import { createUser, loginUser, verifyUser } from "../services/user.service.js";

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
export { createNewUser, loginPreviousUser, userVerification };
