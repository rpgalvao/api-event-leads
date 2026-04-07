import fs from "fs/promises";
import { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import * as UserService from "../services/user.service";
import { getUserSchema, updateUserSchema } from "../validators/auth.validator";

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

export const getUser: RequestHandler = async (req, res) => {
    const { id } = getUserSchema.parse(req.params);
    const user = await UserService.getUserById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    res.status(200).json({ success: true, data: user });
};

export const updateUser: RequestHandler = async (req, res) => {
    const { id } = getUserSchema.parse(req.params);
    const loggedUserId = req.user?.id;
    const loggedUserRole = req.user?.role;
    const file = req.file;

    try {
        if (loggedUserRole !== 'ADMIN' && loggedUserId !== id) {
            if (file) await fs.unlink(file.path);
            throw new AppError('Usuário não autorizado', 403);
        }
        const user = await UserService.getUserById(id);
        if (!user) {
            if (file) await fs.unlink(file?.path);
            return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }
        const data = updateUserSchema.parse(req.body);
        if (file) {
            data.avatar_url = file.filename;
        }
        const updatedUser = await UserService.updateUser(user.id, data);
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        if (file) await fs.unlink(file.path);
        throw error;
    }
};

export const removeUser: RequestHandler = async (req, res) => {
    const { id } = getUserSchema.parse(req.params);
    const role = req.user?.role;
    if (role !== 'ADMIN') throw new AppError('Usuário sem autorização', 403);
    await UserService.removeUser(id as string, role);
    res.status(204).json({ success: true });
};