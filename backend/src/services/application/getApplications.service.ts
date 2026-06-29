import { FilterQuery } from "mongoose";
import Application, { IApplication } from "../../models/application.model";

export const getApplications = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = parsePositiveNumber(query.page, 1);
  const limit = Math.min(parsePositiveNumber(query.limit, 20), 100);
  const skip = (page - 1) * limit;
  const filter: FilterQuery<IApplication> = { userId };

  if (typeof query.status === "string") {
    filter.status = query.status;
  }

  if (typeof query.archived === "string") {
    filter.archived = query.archived === "true";
  }

  if (typeof query.bookmarked === "string") {
    filter.bookmarked = query.bookmarked === "true";
  }

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate("jobId")
      .populate("companyId")
      .populate("resumeId")
      .sort({ lastUpdated: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Application.countDocuments(filter),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const parsePositiveNumber = (value: unknown, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
