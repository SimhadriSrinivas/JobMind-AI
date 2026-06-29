import User from "../../models/user.model";
import { LoginUserInput } from "../../types/auth.types";
import { ApiError } from "../../utils/ApiError";
import { comparePassword } from "./password.service";
import { generateAccessToken } from "./token.service";

const userProjection = "-password -__v";

export const loginUser = async (credentials: LoginUserInput) => {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const safeUser = await User.findById(user._id).select(userProjection);

  if (!safeUser) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    user: safeUser,
    accessToken: generateAccessToken(user._id.toString()),
  };
};
