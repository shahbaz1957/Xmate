import createHttpError from "http-errors";
import userModel from "./userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.ENVIRONMENT !== "development",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ===================================================================================
//                                   REGISTER USER
// ===================================================================================

const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return next(createHttpError(400, "User already exists with this email"));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ sub: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User created successfully",
      accessToken: token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

// ===================================================================================
//                                   LOGIN USER
// ===================================================================================

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "Email and password are required"));
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(
        createHttpError(400, "User not found. Please register first")
      );
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(400, "Email or password is incorrect"));
    }

    // Generate JWT token
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      message: "Login successful",
      accessToken: token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

// ===================================================================================
//                                   LOGOUT USER
// ===================================================================================

const logoutUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(createHttpError(400, "Email is required"));
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return next(createHttpError(400, "User is not registered"));
    }

    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.ENVIRONMENT !== "development",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return next(createHttpError(500, "Internal Server Error"));
  }
};

export { createUser, loginUser, logoutUser };