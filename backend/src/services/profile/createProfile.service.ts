import Profile from "../../models/profile.model";
import { ProfileInput } from "../../types/profile.types";
import { ApiError } from "../../utils/ApiError";

export const createProfile = async (userId: string, profileData: ProfileInput) => {
  if (!profileData?.personal) {
    throw new ApiError(400, "Personal profile details are required");
  }

  const { firstName, lastName, email, phone } = profileData.personal;

  if (!firstName || !lastName || !email || !phone) {
    throw new ApiError(400, "First name, last name, email and phone are required");
  }

  const existingProfile = await Profile.findOne({ userId });

  if (existingProfile) {
    throw new ApiError(409, "Career profile already exists");
  }

  return Profile.create({
    userId,
    ...profileData,
    personal: {
      ...profileData.personal,
      email: email.trim().toLowerCase(),
    },
  });
};
