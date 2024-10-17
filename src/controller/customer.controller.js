import httpStatus from "http-status";
import {
  addCustomer,
  addFavorite,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
} from "../services/customer.service.js";
import { ApiError } from "../errors/ApiError.js";

const addCustomerHandler = async (req, res) => {
  const { name, email, phoneNumber, password, profilePicture } = req.body;

  try {
    const { userId, customerId } = await addCustomer({
      name,
      email,
      phoneNumber,
      password,
      profilePicture,
    });

    res.status(httpStatus.CREATED).json({
      success: true,
      message: "Customer Created Successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};
 const addFavoriteHandler = async (req, res) => {
  const { id: providerId } = req.params;

  try {
    const response = await addFavorite(req.user.userId, providerId);
    res.status(200).json(response);
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllCustomersHandler = async (req, res, next) => {
  try {
    const customers = await getAllCustomers();

    res.status(httpStatus.OK).json({
      success: true,
      data: customers.map((customer) => ({
        id: customer._id,
        name: customer.user.name,
        email: customer.user.email,
        phoneNumber: customer.user.phoneNumber,
        profilePicture: customer.user.profilePicture,
        isValid: customer.user.isValid,
      })),
    });
  } catch (error) {
    new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const getCustomerByIdHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await getCustomerById(id);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Internal server error"
    );
  }
};

const updateCustomerHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phoneNumber, profilePicture, isValid } = req.body;

  try {
    const updatedCustomer = await updateCustomer(
      id,
      name,
      email,
      phoneNumber,
      profilePicture,
      isValid
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "Customer Updated Successfully",
      user: {
        name: updatedCustomer.user.name,
        email: updatedCustomer.user.email,
        phoneNumber: updatedCustomer.user.phoneNumber,
        profilePicture: updatedCustomer.user.profilePicture,
        roleId: updatedCustomer._id,
        role: updatedCustomer.user.role,
        id: updatedCustomer.user._id,
        balance: updatedCustomer.balance,
      },
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

export {
  addCustomerHandler,
  getAllCustomersHandler,
  getCustomerByIdHandler,
  updateCustomerHandler,
  addFavoriteHandler
};
