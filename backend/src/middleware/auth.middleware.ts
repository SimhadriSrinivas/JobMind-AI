import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyAccessToken } from "../services/auth/token.service";

export type AuthenticatedRequest = Request & {
  user?: Omit<IUser, "password">;
};

export const authMiddleware = asyncHandler(
  async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : undefined;

    if (!token) {
      throw new ApiError(401, "Access token is required");
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.userId).select("-password -__v");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  }
);
