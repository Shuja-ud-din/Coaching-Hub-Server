import httpStatus from "http-status";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Customer from "../models/customerModel.js";
import Service from "../models/serviceModel.js";
import Appointment from "../models/appointmentModel.js";
import Provider from "../models/providerModel.js";
import bcrypt from "bcryptjs";

const addAdmin = async ({
  name,
  email,
  phoneNumber,
  password,
  profilePicture,
}) => {
  const emailExists = await User.findOne({ email });
  const phoneExists = await User.findOne({ phoneNumber });

  if (emailExists || phoneExists) {
    throw new Error(
      `${emailExists ? "Email" : "Phone number"} already taken`,
      409
    );
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: encryptedPassword,
    phoneNumber,
    role: "Admin",
    isValid: true,
    profilePicture,
  });

  await Admin.create({
    user: user._id,
  });
};

const getAllAdmins = async () => {
  const admins = await Admin.find({}).populate("user");

  return admins.map((admin) => ({
    id: admin._id,
    name: admin.user.name,
    email: admin.user.email,
    phoneNumber: admin.user.phoneNumber,
    profilePicture: admin.user.profilePicture,
    isValid: admin.user.isValid,
  }));
};
const getAdmin = async (id) => {
  const admin = await Admin.findOne({ _id: id }).populate("user");
  if (!admin) {
    throw new Error("Admin not found", httpStatus.NOT_FOUND);
  }
  return {
    id: admin._id,
    name: admin.user.name,
    email: admin.user.email,
    phoneNumber: admin.user.phoneNumber,
    profilePicture: admin.user.profilePicture,
    isValid: admin.user.isValid,
  };
};

const updateAdmin = async ({
  id,
  name,
  email,
  phoneNumber,
  profilePicture,
  isValid,
}) => {
  const admin = await Admin.findOne({ _id: id }).populate("user");

  if (!admin) {
    throw new Error("Admin not found", httpStatus.NOT_FOUND);
  }

  await User.findByIdAndUpdate(admin.user._id, {
    name,
    email,
    phoneNumber,
    profilePicture,
    isValid: isValid || false,
  });
};

const deleteAdmin = async (id) => {
  const admin = await Admin.findOne({ _id: id }).populate("user");

  if (!admin) {
    throw new Error("Admin not found", httpStatus.NOT_FOUND);
  }

  await User.findByIdAndDelete(admin.user._id);
  await Admin.findByIdAndDelete(admin._id);
};

const toggleAdminStatus = async (id, isValid) => {
  const admin = await Admin.findOne({ _id: id }).populate("user");

  if (!admin) {
    throw new Error("Admin not found", httpStatus.NOT_FOUND);
  }

  await User.findByIdAndUpdate(admin.user._id, {
    isValid,
  });
  return isValid;
};

const getAdminDashboardData = async () => {
  const noOfCustomers = await Customer.countDocuments();
  const noOfAppointments = await Appointment.countDocuments();
  const noOfServices = await Service.countDocuments();

  let topProviders = await Provider.find({})
    .sort({ rating: -1 })
    .limit(4)
    .populate("user", "name email profilePicture");

  let recentCustomers = await Customer.find({})
    .limit(3)
    .populate("user", "name email isValid profilePicture");

  let recentAppointments = await Appointment.find({
    status: "Scheduled",
  })
    .limit(5)
    .populate({
      path: "customer",
      select: "user",
      populate: {
        path: "user",
        model: "User",
        select: "name",
      },
    })
    .populate({
      path: "provider",
      select: "user",
      populate: {
        path: "user",
        model: "User",
        select: "name",
      },
    })
    .populate({
      path: "service",
      model: "Service",
      select: "name",
    });

  // Mapping the data to a more readable format
  topProviders = topProviders.map((provider) => ({
    id: provider._id,
    name: provider.user.name,
    email: provider.user.email,
    profilePicture: provider.user.profilePicture,
  }));

  recentCustomers = recentCustomers.map((customer) => ({
    id: customer._id,
    name: customer.user.name,
    email: customer.user.email,
    isValid: customer.user.isValid,
    profilePicture: customer.user.profilePicture,
  }));

  recentAppointments = recentAppointments.map((appointment) => ({
    id: appointment._id,
    customer: appointment.customer.user.name,
    provider: appointment.provider.user.name,
    service: appointment.service.name,
    date: appointment.date,
  }));

  return {
    revenue: 0, // Placeholder, replace with actual calculation if needed
    noOfCustomers,
    noOfAppointments,
    noOfServices,
    topProviders,
    recentCustomers,
    recentAppointments,
  };
};

export {
  addAdmin,
  getAllAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  toggleAdminStatus,
  getAdminDashboardData,
};
