import Profile from "../../models/profile.model";
import { UpdateProfileInput } from "../../types/profile.types";
import { ApiError } from "../../utils/ApiError";

export const updateProfile = async (
  userId: string,
  profileData: UpdateProfileInput
) => {
  if (!profileData || Object.keys(profileData).length === 0) {
    throw new ApiError(400, "Profile update data is required");
  }

  const updatePayload = normalizeProfileUpdate(profileData);

  const profile = await Profile.findOneAndUpdate(
    { userId },
    { $set: updatePayload },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!profile) {
    throw new ApiError(404, "Career profile not found");
  }

  return profile;
};

const normalizeProfileUpdate = (profileData: UpdateProfileInput) => {
  const updatePayload: Record<string, unknown> = {};

  Object.entries(profileData).forEach(([section, value]) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      updatePayload[section] = value;
      return;
    }

    Object.entries(value).forEach(([key, nestedValue]) => {
      if (
        section === "personal" &&
        key === "email" &&
        typeof nestedValue === "string"
      ) {
        updatePayload[`${section}.${key}`] = nestedValue.trim().toLowerCase();
        return;
      }

      updatePayload[`${section}.${key}`] = nestedValue;
    });
  });

  return updatePayload;
};
