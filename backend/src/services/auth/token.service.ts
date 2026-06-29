import jwt from "jsonwebtoken";

export const generateAccessToken = (
  userId: string
): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET not found");
  }

  return jwt.sign(
    {
      userId,
    },
    secret,
    {
      expiresIn: "7d",
    }
  );
};