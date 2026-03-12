import { Prisma } from "../generated/prisma/client";
import { checkPassword, hashPassword } from "../libs/bcrypt";
import { generateToken } from "../libs/jwt";
import { prisma } from "../libs/prisma";
import * as UserService from '../services/user.service';

export const registerUser = async (data: Prisma.UserCreateInput) => {
    const emailInUse = await UserService.getUserByEmail(data.email);
    if (emailInUse) return null;
    const hashedPassword = await hashPassword(data.password);
    const { name, email, password, role } = data;
    const result = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role
        }
    });

    return result ?? null;
};

export const loginUser = async (email: string, password: string) => {
    const user = await UserService.getUserByEmail(email);
    if (!user) return null;
    const verifyPassword = await checkPassword(password, user.password);
    console.log('check: ', verifyPassword);
    if (!verifyPassword) return null;
    const token = generateToken({ id: user.id, role: user.role });
    return token;
};