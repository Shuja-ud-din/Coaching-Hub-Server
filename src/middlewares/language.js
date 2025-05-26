import User from "../models/userModel.js";

const languageMiddleware = async (req, res, next) => {
  let lang = req.headers["accept-language"];

  if (lang) {
    if (lang !== "en" && lang !== "ar") {
      lang = "en";
    }
  }

  if (!lang) {
    const userId = req.user?.userId;
    if (userId) {
      const user = await User.findById(userId);
      lang = user?.language || "en";
    } else {
      lang = "en";
    }
  }

  req.language = lang;
  next();
};

export default languageMiddleware;
