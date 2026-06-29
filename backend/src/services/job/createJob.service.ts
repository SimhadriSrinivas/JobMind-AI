import { Types } from "mongoose";
import Company from "../../models/company.model";
import Job from "../../models/job.model";
import { JobInput } from "../../types/job.types";
import { ApiError } from "../../utils/ApiError";

export const createJob = async (jobData: JobInput) => {
  if (!jobData.title || !jobData.description) {
    throw new ApiError(400, "Job title and description are required");
  }

  const companyId = await resolveCompanyId(jobData);

  return Job.create({
    ...jobData,
    companyId,
    skills: normalizeList(jobData.skills),
    responsibilities: normalizeList(jobData.responsibilities),
    qualifications: normalizeList(jobData.qualifications),
    benefits: normalizeList(jobData.benefits),
  });
};

const resolveCompanyId = async (jobData: JobInput) => {
  if (jobData.companyId) {
    const companyId = jobData.companyId.toString();

    if (!Types.ObjectId.isValid(companyId)) {
      throw new ApiError(400, "Invalid company id");
    }

    const company = await Company.findById(companyId);

    if (!company) {
      throw new ApiError(404, "Company not found");
    }

    return company._id;
  }

  if (!jobData.company?.companyName) {
    throw new ApiError(400, "Company details are required");
  }

  const company = await Company.create(jobData.company);
  return company._id;
};

const normalizeList = (items?: string[]): string[] => {
  return Array.from(new Set((items || []).map((item) => item.trim()).filter(Boolean)));
};
