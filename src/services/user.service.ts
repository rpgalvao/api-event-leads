import { User } from "../generated/prisma/client";
import { UserUpdateInput } from "../generated/prisma/models";
import { hashPassword } from "../libs/bcrypt";
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

export const updateUser = async (id: string, data: any) => {
    const updateData: any = { ...data };
    if (updateData.email) {
        const newEmail = await getUserByEmail(updateData.email);
        if (newEmail) {
            return null;
        }
    }

    if (updateData.password) {
        updateData.password = await hashPassword(updateData.password);
    }
    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar_url: true
        }
    });
    return updatedUser ?? null;
};