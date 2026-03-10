import { prisma } from "../libs/prisma";

export const getUserByEmail = async (email: string) => {
    const result = prisma.user.findUnique({
        where: { email }
    });

    return result ?? null;
};