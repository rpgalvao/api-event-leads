import { AppError } from "../errors/AppError";
import { Prisma, User } from "../generated/prisma/client";
import { hashPassword } from "../libs/bcrypt";
import { prisma } from "../libs/prisma";
import { setFullURL } from "../utils/setFullUrl";
import { StorageProvider } from "../providers/StorageProvider";

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
    });

    if (!user) return null;

    return {
        ...user,
        avatar_url: user.avatar_url ? setFullURL(`files/avatars/${(user.avatar_url)}`) : null
    };
};

export const listUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar_url: true,
            createdAt: true,
            updatedAt: true
        }
    });

    const usersWithAvatarUrl = users.map(user => {
        return {
            ...user,
            avatar_url: user.avatar_url ? setFullURL(`files/avatars/${user.avatar_url}`) : null
        };
    });

    return usersWithAvatarUrl;
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError('Usuário não encontrado', 404);

    const updateData = { ...data };

    const storage = new StorageProvider();

    if (updateData.avatar_url && typeof updateData.avatar_url === 'string') {
        await storage.saveFile(updateData.avatar_url, 'avatars', 200);
        if (user.avatar_url) {
            await storage.deleteFile(user.avatar_url, 'avatars');
        }
    }

    if (updateData.email && updateData.email !== user.email) {
        const emailExists = await getUserByEmail(updateData.email as string);
        if (emailExists) {
            throw new AppError("E-mail informado já está em uso", 400);
        }
    }

    if (updateData.password) {
        updateData.password = await hashPassword(updateData.password as string);
    }

    const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar_url: true,
            createdAt: true,
            updatedAt: true
        }
    });
    if (!updatedUser) throw new AppError("Erro ao atualizar usuário", 500);

    if (updatedUser.avatar_url) {
        updatedUser.avatar_url = setFullURL(`files/avatars/${updatedUser.avatar_url}`);
    }
    return updatedUser;
};

export const removeUser = async (id: string, role: string) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError('Usuário não encontrado', 404);
    if (role !== 'ADMIN') throw new AppError('Usuário sem permissão de deleção', 403);
    if (user.avatar_url) {
        const storage = new StorageProvider();
        await storage.deleteFile(user.avatar_url, 'avatars');
    }
    return await prisma.user.delete({ where: { id } });
};