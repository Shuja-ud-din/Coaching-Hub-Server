import { ApiError } from "../errors/ApiError.js";
import httpStatus from "http-status";
import {
  addAppointment,
  getAllAppointments,
  getAppointmentById,
} from "../services/appointment.service.js";
const addAppointment = async (req, res) => {
  try {
    const { service, date } = req.body;
    const customerId = req.body.customer;
    const appointment = await addAppointment(service, date, customerId);

    res.status(201).json({
      success: true,
      appointmentId: appointment._id,
      message: "Appointment created successfully",
    });
  } catch (error) {
    new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};
const getAppointments = async (req, res) => {
  try {
    const { user } = req;
    const appointments = await getAllAppointments(user);

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const getAppointmentByIdHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await getAppointmentById(id);
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};
