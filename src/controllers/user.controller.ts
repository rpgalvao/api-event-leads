import fs from "fs/promises";
import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import * as UserService from "../services/user.service";
import { updateUserSchema } from "../validators/auth.validator";

export const listUsers: RequestHandler = async (req, res) => {
    const role = req.user?.role;
    if (role !== 'ADMIN') throw new AppError('Usuário sem permissão para essa função', 403);
    const users = await UserService.listUsers();
    res.status(200).json({ success: true, data: users });
};

export const getProfile: RequestHandler = async (req, res) => {
    const userId = req.user;
    if (!userId) return res.status(401).json({ success: false, message: 'Não autorizado' });
    const user = await UserService.getUserById(userId.id);
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado!' });
    res.status(200).json({ success: true, data: user });
};

export const updateUser: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const loggedUserId = req.user?.id;
    const loggedUserRole = req.user?.role;
    if (loggedUserRole !== 'ADMIN' && loggedUserId !== id) {
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        throw new AppError('Usuário não autorizado', 403);
    }
    const data = updateUserSchema.parse(req.body);

    if (req.file) {
        data.avatar_url = req.file.filename;
    }

    const user = await UserService.getUserById(id as string);
    if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    const updatedUser = await UserService.updateUser(user.id, data);
    res.status(200).json({ success: true, data: updatedUser });
};

export const removeUser: RequestHandler = async (req, res) => {
    const { id } = req.params;
    const role = req.user?.role;
    if (role !== 'ADMIN') throw new AppError('Usuário sem autorização', 403);
    await UserService.removeUser(id as string, role);
    res.status(204).json({ success: true });
};