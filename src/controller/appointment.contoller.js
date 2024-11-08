import { ApiError } from "../errors/ApiError.js";
import httpStatus from "http-status";
import {
  addAppointment,
  cancelAppointmentService,
  getAllAppointments,
  getAppointmentById,
  markAppointmentAsConducted,
  updateAppointmentLink,
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

 const cancelAppointmentHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const result = await cancelAppointmentService(id, reason);

    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const markAppointmentAsConductedHandler = async(req,res)=>{
  try{
    const{id:appointmentId} = req.params;
    await markAppointmentAsConducted(appointmentId)
    res.status(200).json({ success: true });
  }catch(error){
    throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
    );
  }
}
const updateAppointmentLinkHandler = async(req,res) =>{
  try{
    const {id:appointmentId} = req.params;
    const {link} = req.body
    const appointment=  await updateAppointmentLink(appointmentId,link);
    res.status(200).json({
      success: true,
      link: appointment.link,
    });
  }catch(error){
     throw new ApiError(
      error.statusCode || httpStatus.BAD_REQUEST,
      error.message || "Internal server error"
     )
  }

}
export {
  addAppointmentHandler,
  getAllAppointmentsHandler,
  getAppointmentByIdHandler,
  cancelAppointmentHandler,
  markAppointmentAsConductedHandler,
  updateAppointmentLinkHandler,
};
