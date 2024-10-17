import Customer from "../models/customerModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createSupportChat } from "./chat.service.js";
import httpStatus from "http-status";
import Provider from '../models/providerModel.js'

const addCustomer = async ({
  name,
  email,
  phoneNumber,
  password,
  profilePicture,
}) => {
  // Check if email or phone number already exists
  const emailExists = await User.findOne({ email });
  const phoneExists = await User.findOne({ phoneNumber });

  if (phoneExists || emailExists) {
    throw new Error(`${phoneExists ? "Phone Number" : "Email"} already taken`);
  }

  // Hash the password
  const encryptedPassword = await bcrypt.hash(password, 10);

  // Create the new user
  const user = await User.create({
    name,
    email,
    password: encryptedPassword,
    phoneNumber,
    role: "Customer",
    isValid: true,
    profilePicture,
  });

  // Ensure user creation was successful
  if (!user) {
    throw new Error("Failed to create user");
  }

  // Create the customer linked to the user
  const customer = await Customer.create({
    user: user._id,
  });

  // Ensure customer creation was successful
  if (!customer) {
    throw new Error("Failed to create customer");
  }

  // Create a support chat for the customer

  // const chat = await createSupportChat(user._id);
  // if (!chat) {
  //   throw new Error("Failed to create support chat");
  // }

  // customer.chats.push(chat._id);
  await customer.save();

  return {
    userId: user._id,
    customerId: customer._id,
  };
};
const addFavorite= async (userId, providerId) => {
  // Find the customer by user ID
  const customer = await Customer.findOne({ user: userId });

  if (!customer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
  }

  // Validate the provider by its ID
  const isProviderValid = await Provider.findOne({ _id: providerId });

  if (!isProviderValid) {
    throw new ApiError(httpStatus.NOT_FOUND, "Provider not found");
  }

  // Check if the provider is already in the favorites list
  if (customer.favorites.includes(providerId)) {
    return {
      success: true,
      message: "Provider already exists in favorites",
    };
  }

  // Add the provider to favorites
  customer.favorites.push(providerId);
  await customer.save();

  return {
    success: true,
    message: "Provider added to favorites successfully",
  };
};

const getAllCustomers = async () => {
  // Simply fetch and return customers
  return Customer.find({}).populate("user");
};

const getCustomerById = async (id) => {
  const customer = await Customer.findOne({ _id: id })
    .populate("user")
    .populate({
      path: "appointments",
      populate: [
        {
          path: "provider",
          populate: {
            path: "user",
          },
        },
        {
          path: "service",
        },
        {
          path: "customer",
          populate: {
            path: "user",
          },
        },
      ],
    });

  if (!customer) {
    throw new Error("Customer not found", httpStatus.NOT_FOUND);
  }

  const appointments = customer.appointments.map((appointment, index) => {
    return {
      index: index + 1,
      id: appointment._id,
      provider: appointment.provider.user.name,
      service: appointment.service.name,
      status: appointment.status,
      date: appointment.date,
    };
  });
  return {
    id: customer._id,
    name: customer.user.name,
    email: customer.user.email,
    phoneNumber: customer.user.phoneNumber,
    profilePicture: customer.user.profilePicture,
    isValid: customer.user.isValid,
    appointments,
  };
};

const updateCustomer = async (
  id,
  name,
  email,
  phoneNumber,
  profilePicture,
  isValid
) => {
  const customer = await Customer.findOne({ _id: id }).populate("user");

  if (!customer) {
    throw new Error(httpStatus.NOT_FOUND, "Customer not found");
  }

  await User.findByIdAndUpdate(customer.user._id, {
    name,
    email,
    phoneNumber,
    isValid,
    profilePicture,
  });

  const updatedCustomer = await Customer.findOne({ _id: id }).populate("user");

  return updatedCustomer;
};

export { addCustomer, getAllCustomers, getCustomerById, addFavorite,updateCustomer };
