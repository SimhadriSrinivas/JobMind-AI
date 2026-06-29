import User from "../../models/user.model";
import { RegisterUserInput } from "../../types/auth.types";
import { ApiError } from "../../utils/ApiError";
import { hashPassword } from "./password.service";
import { generateAccessToken } from "./token.service";

const userProjection = "-password -__v";

export const registerUser = async (userData: RegisterUserInput) => {
  const { firstName, lastName, email, password, phoneNumber } = userData;

  if (!firstName || !lastName || !email || !password || !phoneNumber) {
    throw new ApiError(400, "All fields are required");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhoneNumber = phoneNumber.trim();

  const existingEmail = await User.findOne({ email: normalizedEmail });

  if (existingEmail) {
    throw new ApiError(409, "Email already exists");
  }

  const existingPhone = await User.findOne({
    phoneNumber: normalizedPhoneNumber,
  });

  if (existingPhone) {
    throw new ApiError(409, "Phone number already exists");
  }

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: await hashPassword(password),
    phoneNumber: normalizedPhoneNumber,
  });

  const createdUser = await User.findById(user._id).select(userProjection);

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return {
    user: createdUser,
    accessToken: generateAccessToken(user._id.toString()),
  };
};
