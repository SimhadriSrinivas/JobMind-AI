import ResumeVersion from "../../models/resumeVersion.model";

export const getResumeVersions = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = parsePositiveNumber(query.page, 1);
  const limit = Math.min(parsePositiveNumber(query.limit, 20), 100);
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = { userId, isActive: true };

  if (typeof query.applicationId === "string") {
    filter.applicationId = query.applicationId;
  }

  if (typeof query.jobId === "string") {
    filter.jobId = query.jobId;
  }

  const [resumeVersions, total] = await Promise.all([
    ResumeVersion.find(filter)
      .populate("jobId")
      .populate("applicationId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ResumeVersion.countDocuments(filter),
  ]);

  return {
    resumeVersions,
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
