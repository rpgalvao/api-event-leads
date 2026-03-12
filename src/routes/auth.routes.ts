import { Router } from "express";
import * as AuthController from '../controllers/auth.controller';
import { authMiddleware } from "../middlewares/auth.middleware";
import { authoryzeByRole } from "../middlewares/role.middleware";

const route = Router();

route.post('/login', AuthController.loginUser);
route.post('/users', authMiddleware, authoryzeByRole, AuthController.registerUser);
route.get('/users/me', authMiddleware, AuthController.getProfile);

export default route;