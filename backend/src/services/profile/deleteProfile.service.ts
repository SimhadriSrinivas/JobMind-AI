import Profile from "../../models/profile.model";
import { ApiError } from "../../utils/ApiError";

export const deleteProfile = async (userId: string) => {
  const profile = await Profile.findOneAndDelete({ userId });

  if (!profile) {
    throw new ApiError(404, "Career profile not found");
  }

  return { id: profile._id.toString() };
};
