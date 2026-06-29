import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

/**
 * Hash Password
 */
export const hashPassword = async (
  password: string
): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare Password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(
    plainPassword,
    hashedPassword
  );
};