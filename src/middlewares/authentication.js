import { env } from "../config/env";
import jwt from "jsonwebtoken";

const isTokenValid = (token) => {
  try {
    const decode = jwt.verify(token, env.JWT_SECRET);
    return decode;
  } catch {
    return false;
  }
};

export { isTokenValid };
