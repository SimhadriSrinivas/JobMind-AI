import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProfile extends Document {
  userId: Types.ObjectId;
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth?: Date;
    gender?: string;
    nationality?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
    };
  };
  career: {
    currentRole?: string;
    experienceYears?: number;
    expectedSalary?: number;
    currentSalary?: number;
    noticePeriod?: string;
    preferredJobRoles: string[];
    preferredLocations: string[];
    remotePreference?: string;
  };
  education: {
    college?: string;
    degree?: string;
    branch?: string;
    cgpa?: number;
    graduationYear?: number;
  };
  social: {
    linkedIn?: string;
    github?: string;
    portfolio?: string;
    leetCode?: string;
    hackerRank?: string;
    codeforces?: string;
  };
  documents: {
    resumeId?: Types.ObjectId;
    certificates: string[];
    transcript?: string;
  };
  preferences: {
    autoApplyEnabled: boolean;
    referralEnabled: boolean;
    emailNotifications: boolean;
    mobileNotifications: boolean;
    dailyApplicationLimit: number;
  };
  workAuthorization: {
    authorizedCountry?: string;
    needSponsorship: boolean;
    visaStatus?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    personal: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      phone: {
        type: String,
        required: true,
        trim: true,
      },
      dateOfBirth: {
        type: Date,
      },
      gender: {
        type: String,
        trim: true,
      },
      nationality: {
        type: String,
        trim: true,
      },
      address: {
        street: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        state: {
          type: String,
          trim: true,
        },
        country: {
          type: String,
          trim: true,
        },
        postalCode: {
          type: String,
          trim: true,
        },
      },
    },
    career: {
      currentRole: {
        type: String,
        trim: true,
      },
      experienceYears: {
        type: Number,
        min: 0,
      },
      expectedSalary: {
        type: Number,
        min: 0,
      },
      currentSalary: {
        type: Number,
        min: 0,
      },
      noticePeriod: {
        type: String,
        trim: true,
      },
      preferredJobRoles: {
        type: [String],
        default: [],
      },
      preferredLocations: {
        type: [String],
        default: [],
      },
      remotePreference: {
        type: String,
        enum: ["REMOTE", "HYBRID", "ONSITE", "NO_PREFERENCE"],
        default: "NO_PREFERENCE",
      },
    },
    education: {
      college: {
        type: String,
        trim: true,
      },
      degree: {
        type: String,
        trim: true,
      },
      branch: {
        type: String,
        trim: true,
      },
      cgpa: {
        type: Number,
        min: 0,
      },
      graduationYear: {
        type: Number,
        min: 1900,
      },
    },
    social: {
      linkedIn: {
        type: String,
        trim: true,
      },
      github: {
        type: String,
        trim: true,
      },
      portfolio: {
        type: String,
        trim: true,
      },
      leetCode: {
        type: String,
        trim: true,
      },
      hackerRank: {
        type: String,
        trim: true,
      },
      codeforces: {
        type: String,
        trim: true,
      },
    },
    documents: {
      resumeId: {
        type: Schema.Types.ObjectId,
        ref: "Resume",
      },
      certificates: {
        type: [String],
        default: [],
      },
      transcript: {
        type: String,
        trim: true,
      },
    },
    preferences: {
      autoApplyEnabled: {
        type: Boolean,
        default: false,
      },
      referralEnabled: {
        type: Boolean,
        default: false,
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      mobileNotifications: {
        type: Boolean,
        default: true,
      },
      dailyApplicationLimit: {
        type: Number,
        min: 0,
        default: 10,
      },
    },
    workAuthorization: {
      authorizedCountry: {
        type: String,
        trim: true,
      },
      needSponsorship: {
        type: Boolean,
        default: false,
      },
      visaStatus: {
        type: String,
        trim: true,
      },
    },
  },
  {
    collection: "master_career_profiles",
    timestamps: true,
  }
);

export default mongoose.model<IProfile>("Profile", profileSchema);
