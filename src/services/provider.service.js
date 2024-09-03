import { isValidObjectId } from "mongoose";
import Customer from "../models/customerModel.js";
import Provider from "../models/providerModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";

const createProvider = async ({
  name,
  email,
  phoneNumber,
  address,
  password,
  speciality,
  experience,
  about,
  workingDays,
  workingTimes,
  profilePicture,
  swarmLink,
  certificates,
}) => {
  const emailExists = await User.findOne({ email });

  const phoneExists = await User.findOne({ phoneNumber });

  if (phoneExists || emailExists) {
    throw new Error(
      `${phoneExists ? "Phone Number" : "Email"} already taken`,
      httpStatus.BAD_REQUEST
    );
  }

  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: encryptedPassword,
    phoneNumber,
    role: "Provider",
    isValid: true,
    profilePicture,
  });

  const provider = await Provider.create({
    user: user._id,
    address,
    speciality,
    experience,
    about,
    workingDays,
    workingTimes,
    swarmLink,
    certificates,
  });

  // const chat = await createSupportChat(user._id);
  // provider.chats.push(chat._id);
  await provider.save();
};

const getAllProviders = async (userId, role) => {
  let customer = null;
  if (role === "Customer") {
    customer = await Customer.findOne({ user: userId });
  }

  let providers = await Provider.find().populate(
    "user",
    "name email phoneNumber isValid profilePicture"
  );

  if (role === "Customer" || role === "Provider") {
    providers = providers.filter((provider) => provider.user.isValid);
  }

  let transformedData = [];

  if (role === "Admin" || role === "Super Admin") {
    transformedData = providers.map((provider) => {
      return {
        id: provider._id,
        name: provider.user.name,
        email: provider.user.email,
        phoneNumber: provider.user.phoneNumber,
        profilePicture: provider.user.profilePicture,
        address: provider.address,
        speciality: provider.speciality,
        experience: provider.experience,
        isValid: provider.user.isValid,
        rating: provider.rating,
      };
    });
  } else {
    transformedData = providers.map((provider) => {
      return {
        id: provider._id,
        name: provider.user.name,
        profilePicture: provider.user.profilePicture,
        address: provider.address,
        speciality: provider.speciality,
        experience: provider.experience,
        isValid: provider.user.isValid,
        rating: provider.rating,
        isFavorite: !!customer?.favorites.includes(provider._id),
      };
    });
  }

  return transformedData;
};

const getProviderById = async (id, user) => {
  const provider = await Provider.findById({ _id: id })
    .populate("user", "name email phoneNumber profilePicture")
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
          path: "customer",
          populate: {
            path: "user",
          },
        },
      ],
    })
    .populate("services")
    .populate("certificates");

  if (!provider) {
    throw new Error("Provider not found", httpStatus.NOT_FOUND);
  }

  const appointments = provider.appointments.map((appointment, index) => ({
    index: index + 1,
    id: appointment._id,
    provider: appointment.provider.user.name,
    service: appointment.service.name,
    status: appointment.status,
    date: appointment.date,
  }));

  const services = provider.services.map((service) => ({
    id: service._id,
    name: service.name,
    price: service.price,
    description: service.description,
    image: service.image,
  }));
  const certificates = provider.certificates.map((certificate) => ({
    title: certificate.title,
    document: certificate.document,
  }));
  const customer = await Customer.findOne({ user: user.userId });

  const data = {
    id: provider._id,
    name: provider.user.name,
    address: provider.address,
    speciality: provider.speciality,
    experience: provider.experience,
    about: provider.about,
    workingDays: provider.workingDays,
    workingTimes: provider.workingTimes,
    profilePicture: provider.user.profilePicture,
    swarmLink: provider.swarmLink,
    appointments,
    services,
    certificates,
    rating: provider.rating,
  };

  if (user.role === "Admin" || user.role === "Super Admin") {
    data.isValid = provider.user.isValid;
    data.email = provider.user.email;
    data.phoneNumber = provider.user.phoneNumber;
  } else {
    data.isFavorite = customer?.favorites.includes(provider._id);
  }

  return data;
};
const updateProvider = async (id, data) => {
  const {
    name,
    email,
    phoneNumber,
    address,
    speciality,
    experience,
    about,
    workingDays,
    workingTimes,
    profilePicture,
    swarmLink,
    // certificates,
  } = data;

  if (!isValidObjectId(id)) {
    throw new Error("Invalid Provider ID", httpStatus.BAD_REQUEST);
  }

  const provider = await Provider.findById(id);

  if (!provider) {
    throw new Error("Provider not found", httpStatus.NOT_FOUND);
  }

  await User.findByIdAndUpdate(provider.user, {
    name,
    email,
    phoneNumber,
    profilePicture,
  });

  provider.address = address;
  provider.speciality = speciality;
  provider.experience = experience;
  provider.about = about;
  provider.swarmLink = swarmLink;
  provider.workingDays = workingDays;
  provider.workingTimes = workingTimes;

  // if (certificates && Array.isArray(certificates)) {
  //   provider.certificates = certificates.map((certificate) => ({
  //     title: certificate.title,
  //     document: certificate.document,
  //   }));
  // }

  await provider.save();

  return provider;
};

export { createProvider, getAllProviders, getProviderById, updateProvider };
