import { Router } from "express";
import * as AuthController from '../controllers/auth.controller';
import { authMiddleware } from "../middlewares/auth.middleware";

const route = Router();

route.post('/login', AuthController.loginUser);
route.post('/users', authMiddleware, AuthController.registerUser);
route.get('/users/me', authMiddleware, AuthController.getProfile);

export default route;