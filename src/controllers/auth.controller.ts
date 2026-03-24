import { RequestHandler } from "express";
import { loginUserSchema, registerUserSchema, updateUserSchema } from "../validators/auth.validator";
import * as AuthService from '../services/auth.service';
import * as UserService from '../services/user.service';

export const registerUser: RequestHandler = async (req, res) => {
    const data = registerUserSchema.parse(req.body);
    const newUser = await AuthService.registerUser(data);
    if (!newUser) return res.status(400).json({ success: false, message: 'O e-mail onformado já está em uso' });
    res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!', data: newUser });
};

export const loginUser: RequestHandler = async (req, res) => {
    const data = loginUserSchema.parse(req.body);
    const { email, password } = data;
    const token = await AuthService.loginUser(email, password);
    if (!token) return res.status(401).json({ success: false, message: 'Credenciais inválidas', data: null });
    res.status(200).json({ success: true, message: 'Login efetuado com sucesso', data: { token } });
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
    const loggedUser = req.user?.id;
    const loggedUserRole = req.user?.role;
    const data = updateUserSchema.parse(req.body);
    if (id !== loggedUser) {
        console.log('os ids sao diferentes');
        return res.status(403).json({ success: false, message: "Usuário não autorizado!" });
    }
    if (loggedUserRole !== 'ADMIN') {
        console.log('não é ADMIN');
        return res.status(403).json({ success: false, message: "Usuário não autorizado!" });
    }

    if (typeof id !== 'string') {
        return res.status(400).json({ success: false, message: "ID do usuário inválida" });
    }
    const updatedUser = await UserService.updateUser(id, data);
    if (!updatedUser) {
        return res.status(400).json({ success: false, data: { message: 'E-mail já está cadastrado. Faça o login' } });
    }
    res.status(200).json({ success: true, data: updatedUser });
};