import User from "../../models/user.model";
import { RegisterUserInput } from "../../types/auth.types";
import { ApiError } from "../../utils/ApiError";
import { hashPassword } from "./password.service";

export const registerUser = async (
  userData: RegisterUserInput
) => {

  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
  } = userData;

  /*
   |--------------------------------------------------------------------------
   | Check Email
   |--------------------------------------------------------------------------
   */

  const existingEmail = await User.findOne({
    email,
  });

  if (existingEmail) {
    throw new ApiError(
      409,
      "Email already exists"
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Check Phone
   |--------------------------------------------------------------------------
   */

  const existingPhone = await User.findOne({
    phoneNumber,
  });

  if (existingPhone) {
    throw new ApiError(
      409,
      "Phone number already exists"
    );
  }

  /*
   |--------------------------------------------------------------------------
   | Hash Password
   |--------------------------------------------------------------------------
   */

  const hashedPassword =
    await hashPassword(password);

  /*
   |--------------------------------------------------------------------------
   | Create User
   |--------------------------------------------------------------------------
   */

  const user = await User.create({

    firstName,

    lastName,

    email,

    password: hashedPassword,

    phoneNumber,

  });

  return user;
};