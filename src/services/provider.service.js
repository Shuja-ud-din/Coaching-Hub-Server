import Customer from "../models/customerModel";
import Provider from "../models/providerModel";
import User from "../models/userModel";
import { createSupportChat } from "./chat.service";

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

  const chat = await createSupportChat(user._id);
  provider.chats.push(chat._id);
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

export { createProvider, getAllProviders };
