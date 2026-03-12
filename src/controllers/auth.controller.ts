import { RequestHandler } from "express";
import { loginUserSchema, registerUserSchema } from "../validators/auth.validator";
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