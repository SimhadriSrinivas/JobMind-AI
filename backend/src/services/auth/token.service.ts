import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { ApiError } from "../../utils/ApiError";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new ApiError(500, "JWT_SECRET is not configured");
  }

  return secret;
};

export const generateAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, getJwtSecret(), {
    ...options,
  });
};

export const verifyAccessToken = (token: string): JwtPayload & { userId: string } => {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded === "string" ||
      !decoded.userId ||
      typeof decoded.userId !== "string"
    ) {
      throw new ApiError(401, "Invalid access token");
    }

    return decoded as JwtPayload & { userId: string };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired access token");
  }
};
