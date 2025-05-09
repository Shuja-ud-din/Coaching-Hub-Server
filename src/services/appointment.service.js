import { sendFirebaseNotification } from "../config/firebase.js";
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
  const providerExists = await Provider.findById(providerId);

  if (!customerExists) {
    throw new Error("Customer not found", 404);
  }
  if (!providerExists) {
    throw new Error("Provider not found", 404);
  }
  // const serviceExists = await Service.findById(serviceId);
  // if (!serviceExists) {
  //   throw new Error("Service not found", 404);
  // }
  const { sessionPrice, sessionDuration } = providerExists;
  const appointment = await Appointment.create({
    date: new Date(date),
    customer: customerId,
    provider: providerId,
    sessionPrice,
    sessionDuration,
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

  const customerText = `Your appointment with ${appointmentDetails.provider.user.name}  is scheduled on ${appointmentDetails.date}.`;

  const providerSubject = "New Appointment Scheduled";
  const providerText = `You have a new appointment with ${appointmentDetails.customer.user.name} on ${appointmentDetails.date}.`;

  sendMail(
    {
      to: customerEmail,
      subject: customerSubject,
      text: customerText,
    },
    (err, data) => {
      if (err) {
        console.error("Error sending email to customer:", err);
      } else {
        console.log("Customer email sent");
      }
    }
  );

  sendMail(
    {
      to: providerEmail,
      subject: providerSubject,
      text: providerText,
    },
    (err, data) => {
      if (err) {
        console.error("Error sending email to provider:", err);
      } else {
        console.log("Provider email sent");
      }
    }
  );

  // sendNotificationToAdmin(
  //   "New Appointment",
  //   `A new appointment has been created by ${appointmentDetails.customer.user.name}`
  // );

  sendFirebaseNotification({
    userId: provider.user._id,
    title: "New Appointment",
    body: `Your appointment has been Scheduled with ${appointmentDetails.customer.user.name}.`,
    path: `/appointments`,
  });

  // send Notification to Customer
  sendFirebaseNotification({
    userId: customer.user._id,
    title: "Appointment Scheduled",
    body: `Your appointment with ${appointmentDetails.provider.user.name} has been scheduled.`,
    path: `/appointments`,
  });

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
    link:appointment.link,
    status: appointment.status,
  };

  return data;
};

export const cancelAppointmentService = async (appointmentId, reason) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new Error("Appointment not found");
  }

  appointment.status = "Cancelled";
  await appointment.save();

  const appointmentDetails = await Appointment.findById(appointment._id)
    .populate({
      path: "customer",
      populate: { path: "user", model: "User" },
    })
    .populate({
      path: "provider",
      populate: { path: "user", model: "User" },
    })
    .exec();

  const customerEmail = appointmentDetails.customer.user.email;
  const providerEmail = appointmentDetails.provider.user.email;

  const customerSubject = "Appointment Cancelled";
  const customerText = `Your appointment with  ${appointmentDetails.provider.user.name}  on
  ${appointmentDetails.date}
  is cancelled.
   Reason: ${reason}`;

  const providerSubject = "Appointment Cancelled";
  const providerText = `Your appointment with 
  ${appointmentDetails.customer.user.name} on ${appointmentDetails.date} is cancelled.  
   Reason: ${reason}`;

  // Send email to customer and provider
  sendMail(
    {
      to: customerEmail,
      subject: customerSubject,
      text: customerText,
    },
    (err) => {
      if (err) console.log(err);
      else console.log("Customer email sent");
    }
  );

  sendMail(
    {
      to: providerEmail,
      subject: providerSubject,
      text: providerText,
    },
    (err) => {
      if (err) console.log(err);
      else console.log("Provider email sent");
    }
  );

  // send Notification to Provider
  sendFirebaseNotification({
    userId: appointmentDetails.provider.user._id,
    title: "Appointment Cancelled",
    body: `Your appointment with ${appointmentDetails.customer.user.name} has been cancelled.`,
    path: `/appointments`,
  });

  // send Notification to Customer
  sendFirebaseNotification({
    userId: appointmentDetails.customer.user._id,
    title: "Appointment Cancelled",
    body: `Your appointment with ${appointmentDetails.provider.user.name} has been cancelled.`,
    path: `/appointments`,
  });

  return { success: true, message: "Appointment cancelled successfully" };
};
const markAppointmentAsConducted = async (appointmentId) => {
  const appointmentExists = await Appointment.findById(appointmentId);
  if (!appointmentExists) {
    throw new Error("Appoitment not found");
  }
  const conductedAppointment = await Appointment.findByIdAndUpdate(
    appointmentId,
    { status: "Conducted" },
    { new: true }
  );
  return conductedAppointment;
};

const updateAppointmentLink = async(appointmentId,newLink) =>{
   const appointment = await Appointment.findById(appointmentId)
   if (!appointment) {
    throw new Error("Appoitment not found");
  }
  appointment.link = newLink;
  await appointment.save()
  return appointment
}
export {
  addAppointment,
  getAllAppointments,
  getAppointmentById,
  markAppointmentAsConducted,
  updateAppointmentLink,
};
