import { env } from "../config/env.js";
import jwt from "jsonwebtoken";

const isTokenValid = (token) => {
  try {
    const decode = jwt.verify(token, env.JWT_SECRET);
    return decode;
  } catch {
    return false;
  }
};

const authentication = async (req, res, next) => {
  const token =
    req.header("authorization") && req.header("authorization").split(" ")[1];

  if (token) {
    try {
      const userObj = jwt.verify(token, env.JWT_SECRET);

      const user = await User.findOne({ _id: userObj.userId });
      if (!user) {
        res.status(401).send("Invalid Token");
        return;
      }

      if (!user.isValid) {
        res.status(401).send("User is not valid");
        return;
      }

      req.user = userObj;
      next();
    } catch {
      res.status(401).send("Invalid Token");
    }
  } else {
    res.status(401).send("Authenticate Please");
  }
};

export const adminAuthentication = async (req, res, next) => {
  const token =
    req.header("authorization") && req.header("authorization").split(" ")[1];

  if (token) {
    try {
      const userObj = jwt.verify(token, env.JWT_SECRET);
      if (userObj.role === "Admin" || userObj.role === "Super Admin") {
        const user = await User.findOne({ _id: userObj.userId });
        if (!user) {
          res.status(401).send("Invalid Token");
          return;
        }

        if (!user.isValid) {
          res.status(401).send("Admin is not valid");
          return;
        }

        req.user = userObj;
        next();
      } else {
        res.status(405).send("NOT ALLOWED");
      }
    } catch {
      res.status(401).send("Invalid Token");
    }
  } else {
    res.status(401).send("Authenticate Please");
  }
};

export const superAdminAuthentication = async (req, res, next) => {
  const token =
    req.header("authorization") && req.header("authorization").split(" ")[1];

  if (token) {
    try {
      const userObj = jwt.verify(token, env.JWT_SECRET);
      if (userObj.role === "Super Admin") {
        const user = await User.findOne({ _id: userObj.userId });
        if (!user) {
          res.status(401).send("Invalid Token");
          return;
        }

        if (!user.isValid) {
          res.status(401).send("Admin is not valid");
          return;
        }

        req.user = userObj;
        next();
      } else {
        res.status(405).send("NOT ALLOWED");
      }
    } catch {
      res.status(401).send("Invalid Token");
    }
  } else {
    res.status(401).send("Authenticate Please");
  }
};

export { isTokenValid };
