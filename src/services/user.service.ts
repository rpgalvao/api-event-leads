import path from "path";
import fs from 'fs/promises';
import sharp from "sharp";
import { AppError } from "../errors/AppError";
import { Prisma, User } from "../generated/prisma/client";
import { hashPassword } from "../libs/bcrypt";
import { prisma } from "../libs/prisma";
import { setFullURL } from "../utils/setFullUrl";
import { uploadConfig } from "../libs/multer";

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

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError('Usuário não encontrado', 404);

    const updateData = { ...data };

    const newAvatar = updateData.avatar_url;

    if (newAvatar && typeof newAvatar === 'string') {
        const originalPath = path.resolve(uploadConfig.directory, newAvatar);
        const finalPath = path.resolve(uploadConfig.directory, 'avatars', newAvatar);
        try {
            await sharp(originalPath)
                .resize(200, 200)
                .toFormat('jpg')
                .jpeg({ quality: 70 })
                .toFile(finalPath);

            await fs.unlink(originalPath);
        } catch (error) {
            console.log(`Erro no Sharp: ${error}`);
        }

        if (user.avatar_url) {
            const oldAvatarPath = path.resolve(uploadConfig.directory, 'avatars', user.avatar_url);
            try {
                await fs.stat(oldAvatarPath);
                await fs.unlink(oldAvatarPath);
            } catch {
                console.log(`Aviso: Avatar antigo ${user.avatar_url} não encontrado para deleção`);
            }
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