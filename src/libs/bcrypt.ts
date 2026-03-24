import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
};

export const checkPassword = async (password: string, hashedPassword: string) => {
    const tested = await bcrypt.compare(password, hashedPassword);
    return tested ?? null;
};