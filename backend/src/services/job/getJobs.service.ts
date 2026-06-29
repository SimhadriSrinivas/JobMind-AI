import Job from "../../models/job.model";

export const getJobs = async (page = 1, limit = 20) => {
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 100);
  const skip = (safePage - 1) * safeLimit;

  const [jobs, total] = await Promise.all([
    Job.find({ isActive: true })
      .populate("companyId")
      .sort({ postedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    Job.countDocuments({ isActive: true }),
  ]);

  return {
    jobs,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      pages: Math.ceil(total / safeLimit),
    },
  };
};
