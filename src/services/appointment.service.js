import Appointment from "../models/appointmentModel.js";
import Customer from "../models/customerModel.js";
import Provider from "../models/providerModel.js";
import Service from "../models/serviceModel.js";
import sendMail from "../utils/sendMail.js";
import { sendNotificationToAdmin } from "../utils/sendNotification.js";

const addAppointment = async (
  // serviceId,
  date,
  customerId,
  providerId
) => {
  const customerExists = await Customer.findById(customerId);
  if (!customerExists) {
    throw new Error("Customer not found", 404);
  }

  // const serviceExists = await Service.findById(serviceId);
  // if (!serviceExists) {
  //   throw new Error("Service not found", 404);
  // }

  const appointment = await Appointment.create({
    date: new Date(date),
    customer: customerId,
    provider: providerId,
    // provider: serviceExists.provider,
    // service: serviceId,
  });

  const appointmentDetails = await Appointment.findById(appointment._id)
    .populate({
      path: "customer",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate({
      path: "provider",
      populate: {
        path: "user",
        model: "User",
      },
    })
    // .populate("service")
    .exec();

  const customer = appointmentDetails.customer;
  const provider = appointmentDetails.provider;

  customer.appointments.push(appointmentDetails._id);
  provider.appointments.push(appointmentDetails._id);

  await customer.save();
  await provider.save();

  const customerEmail = appointmentDetails.customer.user.email;
  const providerEmail = appointmentDetails.provider.user.email;

  const customerSubject = "Appointment Scheduled";
  const customerText = `Your appointment with ${appointmentDetails.provider.user.name} for ${appointmentDetails.service.name} is scheduled on ${appointmentDetails.date}.`;

  const providerSubject = "New Appointment Scheduled";
  const providerText = `You have a new appointment with ${appointmentDetails.customer.user.name} on ${appointmentDetails.date}.`;

  sendMail(customerEmail, customerSubject, customerText, (err, data) => {
    if (err) {
      console.error("Error sending email to customer:", err);
    } else {
      console.log("Customer email sent");
    }
  });

  sendMail(providerEmail, providerSubject, providerText, (err, data) => {
    if (err) {
      console.error("Error sending email to provider:", err);
    } else {
      console.log("Provider email sent");
    }
  });

  sendNotificationToAdmin(
    "New Appointment",
    `A new appointment has been created by ${appointmentDetails.customer.user.name}`
  );

  return appointmentDetails;
};

const getAllAppointments = async (user) => {
  let filter = {};

  if (user.role === "Customer") {
    const customer = await Customer.findOne({ user: user.userId });
    if (!customer) {
      throw new ApiError(httpStatus.NOT_FOUND, "Customer not found");
    }
    filter = { customer: customer._id };
  } else if (user.role === "Provider") {
    const provider = await Provider.findOne({ user: user.userId });
    if (!provider) {
      throw new ApiError(httpStatus.NOT_FOUND, "Provider not found");
    }
    filter = { provider: provider._id };
  } else if (user.role === "Admin" || user.role === "Super Admin") {
    filter = {};
  } else {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, "Invalid user role");
  }

  const appointments = await Appointment.find(filter)
    .populate({
      path: "customer",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate({
      path: "provider",
      populate: {
        path: "user",
        model: "User",
      },
    })
    // .populate({
    //   path: "service",
    //   model: "Service",
    // })
    .exec();

  return appointments.map((appointment) => {
    return {
      id: appointment._id,
      customer: appointment.customer.user?.name,
      provider: appointment.provider.user?.name,
      providerId: appointment.provider._id,
      providerProfilePic: appointment.provider.user.profilePicture,
      swarmLink: appointment.provider.swarmLink,
      // service: appointment.service?.name || "",
      status: appointment.status,
      date: appointment.date,
    };
  });
};

const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate({
      path: "customer",
      populate: {
        path: "user",
        model: "User",
      },
    })
    .populate({
      path: "provider",
      populate: {
        path: "user",
        model: "User",
      },
    })
    // .populate("service")
    .exec();

  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Appointment not found");
  }

  const customer = appointment.customer;
  const provider = appointment.provider;
  // const service = appointment.service;

  const data = {
    id: appointment._id,
    customer: {
      id: customer._id,
      name: customer.user.name,
      email: customer.user.email,
      phoneNumber: customer.user.phoneNumber,
      profilePicture: customer.profilePicture,
    },
    provider: {
      id: provider._id,
      name: provider.user.name,
      email: provider.user.email,
      phoneNumber: provider.user.phoneNumber,
      profilePicture: provider.profilePicture,
    },
    // service: {
    //   id: service._id,
    //   name: service.name,
    //   description: service.description,
    //   price: service.price,
    // },
    date: appointment.date,
    status: appointment.status,
  };

  return data;
};

export { addAppointment, getAllAppointments, getAppointmentById };
