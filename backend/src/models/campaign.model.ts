import mongoose, { Document, Schema, Types } from "mongoose";
import {
  CampaignStatus,
  CoverLetterStrategy,
  ReferralPriority,
  RemoteType,
  ResumeStrategyType,
  SalaryCurrency,
  SalaryPeriod,
  ScheduleFrequency,
  campaignStatuses,
  coverLetterStrategies,
  referralPriorities,
  remoteTypes,
  resumeStrategyTypes,
  salaryCurrencies,
  salaryPeriods,
  scheduleFrequencies,
} from "../types/campaign.types";
import { OpportunityType, opportunityTypes } from "../types/opportunity.types";

export interface ICampaign extends Document {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  opportunityTypes: OpportunityType[];
  locations: string[];
  remote: {
    enabled: boolean;
    type: RemoteType;
  };
  salary: {
    min?: number;
    max?: number;
    currency: SalaryCurrency;
    period: SalaryPeriod;
  };
  experience: {
    min?: number;
    max?: number;
  };
  skills: string[];
  excludedSkills: string[];
  companies: {
    preferred: string[];
    excluded: string[];
  };
  referral: {
    enabled: boolean;
    priority: ReferralPriority;
  };
  resumeStrategy: {
    type: ResumeStrategyType;
    resumeVersionId?: Types.ObjectId | null;
  };
  coverLetter: {
    enabled: boolean;
    strategy: CoverLetterStrategy;
  };
  applicationLimit: {
    daily: number;
    weekly?: number;
  };
  notifications: {
    mobile: boolean;
    email: boolean;
    inApp: boolean;
  };
  schedule: {
    enabled: boolean;
    frequency: ScheduleFrequency;
    timezone: string;
    preferredRunTime?: string;
  };
  status: CampaignStatus;
  metrics: {
    opportunitiesFound: number;
    applicationsCreated: number;
    applicationsSubmitted: number;
    referralsFound: number;
    responsesReceived: number;
    interviewsReceived: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    opportunityTypes: {
      type: [String],
      enum: opportunityTypes,
      required: true,
      validate: {
        validator: (value: OpportunityType[]) => value.length > 0,
        message: "At least one opportunity type is required",
      },
    },
    locations: {
      type: [String],
      default: [],
    },
    remote: {
      enabled: {
        type: Boolean,
        default: false,
      },
      type: {
        type: String,
        enum: remoteTypes,
        default: "ANY",
      },
    },
    salary: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        enum: salaryCurrencies,
        default: "INR",
      },
      period: {
        type: String,
        enum: salaryPeriods,
        default: "YEARLY",
      },
    },
    experience: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
    },
    skills: {
      type: [String],
      default: [],
    },
    excludedSkills: {
      type: [String],
      default: [],
    },
    companies: {
      preferred: {
        type: [String],
        default: [],
      },
      excluded: {
        type: [String],
        default: [],
      },
    },
    referral: {
      enabled: {
        type: Boolean,
        default: false,
      },
      priority: {
        type: String,
        enum: referralPriorities,
        default: "MEDIUM",
      },
    },
    resumeStrategy: {
      type: {
        type: String,
        enum: resumeStrategyTypes,
        default: "MASTER_RESUME",
      },
      resumeVersionId: {
        type: Schema.Types.ObjectId,
        ref: "ResumeVersion",
        default: null,
      },
    },
    coverLetter: {
      enabled: {
        type: Boolean,
        default: true,
      },
      strategy: {
        type: String,
        enum: coverLetterStrategies,
        default: "AI_GENERATED",
      },
    },
    applicationLimit: {
      daily: {
        type: Number,
        required: true,
        default: 25,
        min: 1,
        max: 100,
      },
      weekly: {
        type: Number,
        min: 1,
      },
    },
    notifications: {
      mobile: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: true,
      },
      inApp: {
        type: Boolean,
        default: true,
      },
    },
    schedule: {
      enabled: {
        type: Boolean,
        default: false,
      },
      frequency: {
        type: String,
        enum: scheduleFrequencies,
        default: "MANUAL",
      },
      timezone: {
        type: String,
        default: "Asia/Kolkata",
        trim: true,
      },
      preferredRunTime: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: campaignStatuses,
      default: "DRAFT",
      index: true,
    },
    metrics: {
      opportunitiesFound: {
        type: Number,
        default: 0,
        min: 0,
      },
      applicationsCreated: {
        type: Number,
        default: 0,
        min: 0,
      },
      applicationsSubmitted: {
        type: Number,
        default: 0,
        min: 0,
      },
      referralsFound: {
        type: Number,
        default: 0,
        min: 0,
      },
      responsesReceived: {
        type: Number,
        default: 0,
        min: 0,
      },
      interviewsReceived: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

campaignSchema.index({ userId: 1, status: 1, updatedAt: -1 });
campaignSchema.index({ userId: 1, name: 1 });

export default mongoose.model<ICampaign>("Campaign", campaignSchema);
