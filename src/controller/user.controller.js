import { ApiError } from "../errors/ApiError";
import { createUser, loginUser } from "../services/user.service";

const createNewUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, password } = req.body;
    const user = await createUser({ name, email, phoneNumber, password });
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      req.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};

const loginPreviousUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await loginUser({ phoneNumber, password });
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
};
export { createNewUser, loginPreviousUser };
