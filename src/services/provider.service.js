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
  timeZone,
  language,
  sessionDuration,
  sessionPrice,
  countryOfResidence,
  nationality,
  degreeName,
  institute,
  yearOfPassingDegree,
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
    timeZone,
    language,
    sessionPrice,
    sessionDuration,
    countryOfResidence,
    nationality,
    degreeName,
    institute,
    yearOfPassingDegree,
  });

  // const chat = await createSupportChat(user._id);
  // // provider.chats.push(chat._id);
  // await provider.save();

  return provider;
};

// const getAllProviders = async (req, res) => {
//   let customer = null;
//   if (req.user.role === "Customer") {
//     customer = await Customer.findOne({ user: req.user.userId });
//   }

//   try {
//     let providers = await Provider.find().populate(
//       "user",
//       "name email phoneNumber isValid profilePicture"
//     );

//     if (req.user.role === "Customer" || req.user.role === "Provider") {
//       providers = providers.filter((provider) => provider.user.isValid);
//     }

//     let transformedData = [];

//     if (req.user.role === "Admin" || req.user.role === "Super Admin") {
//       transformedData = providers.map((provider) => {
//         return {
//           id: provider._id,
//           name: provider.user.name,
//           email: provider.user.email,
//           phoneNumber: provider.user.phoneNumber,
//           profilePicture: provider.user.profilePicture,
//           address: provider.address,
//           speciality: provider.speciality,
//           experience: provider.experience,
//           isValid: provider.user.isValid,
//           rating: provider.rating,
//         };
//       });
//     } else {
//       transformedData = providers.map((provider) => {
//         return {
//           id: provider._id,
//           name: provider.user.name,
//           profilePicture: provider.user.profilePicture,
//           address: provider.address,
//           speciality: provider.speciality,
//           experience: provider.experience,
//           isValid: provider.user.isValid,
//           rating: provider.rating,
//           isFavorite: !!customer?.favorites.includes(provider._id),
//         };
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: transformedData,
//     });
//   } catch (e) {
//     throw new ApiError(httpStatus.BAD_REQUEST, e.message);
//   }
// };

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
    // .populate("services")
    .populate("certificates");

  if (!provider) {
    throw new Error("Provider not found", httpStatus.NOT_FOUND);
  }

  const appointments = provider.appointments.map((appointment, index) => ({
    index: index + 1,
    id: appointment._id,
    provider: appointment.provider.user.name,
    // service: appointment.service.name,
    status: appointment.status,
    date: appointment.date,
  }));

  // const services = provider.services.map((service) => ({
  //   id: service._id,
  //   name: service.name,
  //   price: service.price,
  //   description: service.description,
  //   image: service.image,
  // }));

  const certificates = provider.certificates.map((certificate) => ({
    id: certificate._id,
    title: certificate.title,
    document: certificate.document,
  }));

  const customer = await Customer.findOne({ user: user.userId });

  const data = {
    id: provider._id,
    name: provider.user.name,
    email: provider.user.email,
    phoneNumber: provider.user.phoneNumber,
    address: provider.address,
    speciality: provider.speciality,
    experience: provider.experience,
    about: provider.about,
    isValid: provider.user.isValid,
    workingDays: provider.workingDays,
    workingTimes: provider.workingTimes,
    profilePicture: provider.user.profilePicture,
    swarmLink: provider.swarmLink,
    appointments,
    // services,
    rating: provider.rating,
    certificates,
    timeZone: provider.timeZone,
    language: provider.language,
    sessionPrice: provider.sessionPrice,
    sessionDuration: provider.sessionDuration,
  };

  if (user.role === "Admin" || user.role === "Super Admin") {
    data.isValid = provider.user.isValid;
    data.email = provider.user.email;
    data.phoneNumber = provider.user.phoneNumber;
  } else {
    data.isFavorite = customer?.favorites.includes(provider._id);

    delete data.isValid;
    delete data.email;
    delete data.phoneNumber;
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

  await provider.save();

  return provider;
};

const getProviderReviews = async (id) => {

  if (!isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Provider ID");
  }

    const provider = await Provider.findById(id).populate({
      path: "reviews",
      populate: {
        path: "reviewedBy",
      },
    });

    if (!provider) {
      throw new ApiError(httpStatus.NOT_FOUND, "Provider not found");
    }

    const reviews = provider.reviews.map((review) => {
      return {
        rating: review.rating,
        comment: review.comment,
        reviewedBy: {
          id: review.reviewedBy._id,
          name: review.reviewedBy.name,
          profilePicture: review.reviewedBy.profilePicture,
        },
      };
    });

    return reviews
};

const addReview = async (id, rating,comment,userId,role) => {


  if (!isValidObjectId(id)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Provider ID");
  }

  if (role !== "Customer") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Only customers can add reviews"
    );
  }

    const provider = await Provider.findById(id);

    if (!provider) {
      throw new ApiError(httpStatus.NOT_FOUND, "Provider not found");
    }

    provider.reviews.push({
      rating,
      comment,
      reviewedBy: userId,
    });

    await provider.save();

 
};

export { createProvider, getAllProviders, getProviderById, updateProvider,getProviderReviews,addReview };
