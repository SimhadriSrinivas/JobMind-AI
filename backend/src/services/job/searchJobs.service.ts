import { FilterQuery, Types } from "mongoose";
import Company from "../../models/company.model";
import Job, { IJob } from "../../models/job.model";
import { JobSearchQuery } from "../../types/job.types";

export const searchJobs = async (query: JobSearchQuery) => {
  const filter: FilterQuery<IJob> = { isActive: true };
  const page = parsePositiveNumber(query.page, 1);
  const limit = Math.min(parsePositiveNumber(query.limit, 20), 100);
  const skip = (page - 1) * limit;

  if (query.keyword) {
    filter.$text = { $search: query.keyword };
  }

  if (query.location) {
    filter.location = new RegExp(escapeRegExp(query.location), "i");
  }

  if (query.experience) {
    filter.experience = { $lte: parsePositiveNumber(query.experience, 0) };
  }

  if (query.remote !== undefined) {
    filter.isRemote = query.remote === "true";
  }

  if (query.employmentType) {
    filter.employmentType = new RegExp(escapeRegExp(query.employmentType), "i");
  }

  if (query.skills) {
    filter.skills = {
      $in: query.skills.split(",").map((skill) => new RegExp(escapeRegExp(skill.trim()), "i")),
    };
  }

  if (query.salary) {
    filter.salary = { $gte: parsePositiveNumber(query.salary, 0) };
  }

  if (query.company) {
    const companies = await Company.find({
      companyName: new RegExp(escapeRegExp(query.company), "i"),
    }).select("_id");

    filter.companyId = { $in: companies.map((company) => company._id as Types.ObjectId) };
  }

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate("companyId")
      .sort({ postedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Job.countDocuments(filter),
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const parsePositiveNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const escapeRegExp = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
