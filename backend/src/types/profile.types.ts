import { Types } from "mongoose";

export interface ProfilePersonalInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: Date | string;
  gender?: string;
  nationality?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

export interface ProfileCareerInput {
  currentRole?: string;
  experienceYears?: number;
  expectedSalary?: number;
  currentSalary?: number;
  noticePeriod?: string;
  preferredJobRoles?: string[];
  preferredLocations?: string[];
  remotePreference?: string;
}

export interface ProfileEducationInput {
  college?: string;
  degree?: string;
  branch?: string;
  cgpa?: number;
  graduationYear?: number;
}

export interface ProfileSocialInput {
  linkedIn?: string;
  github?: string;
  portfolio?: string;
  leetCode?: string;
  hackerRank?: string;
  codeforces?: string;
}

export interface ProfileDocumentsInput {
  resumeId?: string | Types.ObjectId;
  certificates?: string[];
  transcript?: string;
}

export interface ProfilePreferencesInput {
  autoApplyEnabled?: boolean;
  referralEnabled?: boolean;
  emailNotifications?: boolean;
  mobileNotifications?: boolean;
  dailyApplicationLimit?: number;
}

export interface ProfileWorkAuthorizationInput {
  authorizedCountry?: string;
  needSponsorship?: boolean;
  visaStatus?: string;
}

export interface ProfileInput {
  personal: ProfilePersonalInput;
  career?: ProfileCareerInput;
  education?: ProfileEducationInput;
  social?: ProfileSocialInput;
  documents?: ProfileDocumentsInput;
  preferences?: ProfilePreferencesInput;
  workAuthorization?: ProfileWorkAuthorizationInput;
}

export type UpdateProfileInput = Partial<ProfileInput>;
