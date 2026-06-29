import { Types } from "mongoose";
import Application from "../../models/application.model";
import { ApiError } from "../../utils/ApiError";

export const deleteApplication = async (
  userId: string,
  applicationId: string
) => {
  if (!Types.ObjectId.isValid(applicationId)) {
    throw new ApiError(400, "Invalid application id");
  }

  const application = await Application.findOneAndDelete({
    _id: applicationId,
    userId,
  });

  if (!application) {
    throw new ApiError(404, "Application not found");
  }

  return { id: application._id.toString() };
};
