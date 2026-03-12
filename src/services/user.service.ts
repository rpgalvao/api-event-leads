import { User } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import { setFullURL } from "../utils/setFullUrl";

type UserProfile = Omit<User, 'password'>;

export const getUserByEmail = async (email: string) => {
    const result = prisma.user.findUnique({
        where: { email }
    });

    return result ?? null;
};

export const getUserById = async (id: string): Promise<UserProfile | null> => {
    const user = await prisma.user.findFirst({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            avatar_url: true
        }
    });

    if (!user) return null;

    return {
        ...user,
        avatar_url: user.avatar_url ? setFullURL(user.avatar_url) : null
    };
};