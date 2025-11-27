import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../conf/config.js";

const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Access Denied: No Token Provided!"));
  }

  try {
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return next(createHttpError(401, "Invalid Token Format"));
    }
    
    const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (error) {
    return next(createHttpError(401, "Invalid Token"));
  }
};

export default authenticateUser;
