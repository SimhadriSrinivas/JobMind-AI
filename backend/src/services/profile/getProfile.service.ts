import Profile from "../../models/profile.model";
import { ApiError } from "../../utils/ApiError";

export const getProfile = async (userId: string) => {
  const profile = await Profile.findOne({ userId });

  if (!profile) {
    throw new ApiError(404, "Career profile not found");
  }

  return profile;
};
