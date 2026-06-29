import Application from "../../models/application.model";

export const getApplicationAnalytics = async (userId: string) => {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalApplications,
    savedJobs,
    applied,
    interviews,
    offers,
    rejected,
    applicationsThisWeek,
    applicationsThisMonth,
    responseApplications,
  ] = await Promise.all([
    Application.countDocuments({ userId }),
    Application.countDocuments({ userId, status: "SAVED" }),
    Application.countDocuments({ userId, status: "APPLIED" }),
    Application.countDocuments({
      userId,
      status: {
        $in: ["INTERVIEW", "HR_ROUND", "TECHNICAL_ROUND", "FINAL_ROUND"],
      },
    }),
    Application.countDocuments({ userId, status: { $in: ["OFFER", "ACCEPTED"] } }),
    Application.countDocuments({ userId, status: "REJECTED" }),
    Application.countDocuments({ userId, createdAt: { $gte: weekStart } }),
    Application.countDocuments({ userId, createdAt: { $gte: monthStart } }),
    Application.find({
      userId,
      appliedDate: { $exists: true },
      lastUpdated: { $exists: true },
      status: { $ne: "SAVED" },
    }).select("appliedDate lastUpdated"),
  ]);

  const acceptanceRate =
    totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0;
  const rejectionRate =
    totalApplications > 0 ? Math.round((rejected / totalApplications) * 100) : 0;
  const averageResponseDays = calculateAverageResponseDays(responseApplications);

  return {
    totalApplications,
    savedJobs,
    applied,
    interviews,
    offers,
    rejected,
    acceptanceRate,
    rejectionRate,
    averageResponseDays,
    applicationsThisWeek,
    applicationsThisMonth,
  };
};

const calculateAverageResponseDays = (
  applications: Array<{ appliedDate?: Date; lastUpdated?: Date }>
): number => {
  const responseDays = applications
    .filter((application) => application.appliedDate && application.lastUpdated)
    .map((application) => {
      const diff =
        application.lastUpdated!.getTime() - application.appliedDate!.getTime();
      return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
    });

  if (responseDays.length === 0) {
    return 0;
  }

  const totalDays = responseDays.reduce((sum, days) => sum + days, 0);
  return Math.round(totalDays / responseDays.length);
};
