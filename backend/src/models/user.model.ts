import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;

  emailVerified: boolean;

  profilePicture?: string;

  preferredRoles: string[];

  preferredLocations: string[];

  accountType: "FREE" | "PREMIUM";

  createdAt: Date;

  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    profilePicture: {
      type: String,
      default: "",
    },

    preferredRoles: {
      type: [String],
      default: [],
    },

    preferredLocations: {
      type: [String],
      default: [],
    },

    accountType: {
      type: String,
      enum: ["FREE", "PREMIUM"],
      default: "FREE",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);