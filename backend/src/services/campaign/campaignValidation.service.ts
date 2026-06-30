import { Types } from "mongoose";
import ResumeVersion from "../../models/resumeVersion.model";
import {
  CampaignInput,
  UpdateCampaignInput,
  campaignStatuses,
  coverLetterStrategies,
  referralPriorities,
  remoteTypes,
  resumeStrategyTypes,
  salaryCurrencies,
  salaryPeriods,
  scheduleFrequencies,
} from "../../types/campaign.types";
import { opportunityTypes } from "../../types/opportunity.types";
import { ApiError } from "../../utils/ApiError";

export const validateCampaignInput = async (
  userId: string,
  payload: CampaignInput | UpdateCampaignInput,
  isUpdate = false
): Promise<void> => {
  if (!payload || Object.keys(payload).length === 0) {
    throw new ApiError(400, "Campaign data is required");
  }

  if (!isUpdate || payload.name !== undefined) {
    if (!payload.name || payload.name.trim().length === 0) {
      throw new ApiError(400, "Campaign name is required");
    }
  }

  if (!isUpdate || payload.opportunityTypes !== undefined) {
    if (!payload.opportunityTypes?.length) {
      throw new ApiError(400, "At least one opportunity type is required");
    }
  }

  validateEnumArray(payload.opportunityTypes, opportunityTypes, "Invalid opportunity type");
  validateEnum(payload.remote?.type, remoteTypes, "Invalid remote type");
  validateEnum(payload.salary?.currency, salaryCurrencies, "Invalid salary currency");
  validateEnum(payload.salary?.period, salaryPeriods, "Invalid salary period");
  validateEnum(payload.referral?.priority, referralPriorities, "Invalid referral priority");
  validateEnum(payload.resumeStrategy?.type, resumeStrategyTypes, "Invalid resume strategy");
  validateEnum(
    payload.coverLetter?.strategy,
    coverLetterStrategies,
    "Invalid cover letter strategy"
  );
  validateEnum(payload.schedule?.frequency, scheduleFrequencies, "Invalid schedule frequency");
  validateEnum(payload.status, campaignStatuses, "Invalid campaign status");

  validateRange(payload.salary?.min, payload.salary?.max, "Salary minimum cannot be greater than maximum");
  validateRange(
    payload.experience?.min,
    payload.experience?.max,
    "Experience minimum cannot be greater than maximum"
  );

  if (payload.applicationLimit?.daily !== undefined) {
    validateBoundedNumber(payload.applicationLimit.daily, 1, 100, "Daily application limit must be between 1 and 100");
  }

  if (payload.applicationLimit?.weekly !== undefined) {
    validateBoundedNumber(payload.applicationLimit.weekly, 1, 700, "Weekly application limit must be between 1 and 700");
  }

  const resumeVersionId = payload.resumeStrategy?.resumeVersionId;
  if (resumeVersionId !== undefined && resumeVersionId !== null) {
    if (!Types.ObjectId.isValid(resumeVersionId.toString())) {
      throw new ApiError(400, "Invalid resume version id");
    }

    const resumeVersion = await ResumeVersion.findOne({
      _id: resumeVersionId,
      userId,
    });

    if (!resumeVersion) {
      throw new ApiError(404, "Resume version not found");
    }
  }
};

export const validateCampaignId = (campaignId: string): void => {
  if (!Types.ObjectId.isValid(campaignId)) {
    throw new ApiError(400, "Invalid campaign id");
  }
};

const validateEnum = <T extends readonly string[]>(
  value: string | undefined,
  allowedValues: T,
  message: string
): void => {
  if (value !== undefined && !allowedValues.includes(value)) {
    throw new ApiError(400, message);
  }
};

const validateEnumArray = <T extends readonly string[]>(
  values: string[] | undefined,
  allowedValues: T,
  message: string
): void => {
  if (!values) {
    return;
  }

  if (values.some((value) => !allowedValues.includes(value))) {
    throw new ApiError(400, message);
  }
};

const validateRange = (
  min: number | undefined,
  max: number | undefined,
  message: string
): void => {
  if (min !== undefined && max !== undefined && min > max) {
    throw new ApiError(400, message);
  }
};

const validateBoundedNumber = (
  value: number,
  min: number,
  max: number,
  message: string
): void => {
  if (!Number.isFinite(value) || value < min || value > max) {
    throw new ApiError(400, message);
  }
};
