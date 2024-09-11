import { ApiError } from "../errors/ApiError.js";
import httpStatus from "http-status";
import {
  addAppointment,
  getAllAppointments,
  getAppointmentById,
} from "../services/appointment.service.js";

const addAppointmentHandler = async (req, res) => {
  try {
    const { date, customer, provider } = req.body;
    const appointment = await addAppointment(date, customer, provider);
    res.status(201).json({
      success: true,
      appointmentId: appointment._id,
      message: "Appointment created successfully",
    });
  } catch (error) {
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
};

const getAllAppointmentsHandler = async (req, res) => {
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
export {
  addAppointmentHandler,
  getAllAppointmentsHandler,
  getAppointmentByIdHandler,
};
