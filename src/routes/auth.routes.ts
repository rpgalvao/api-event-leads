import { Router } from "express";
import * as AuthController from '../controllers/auth.controller';
import { authMiddleware } from "../middlewares/auth.middleware";
import { authoryzeByRole } from "../middlewares/role.middleware";
import multer from "multer";
import { uploadConfig } from "../libs/multer";

const route = Router();
const upload = multer(uploadConfig);

route.post('/login', AuthController.loginUser);
route.post('/users', authMiddleware, authoryzeByRole, AuthController.registerUser);
route.get('/users/me', authMiddleware, AuthController.getProfile);
route.patch('/users/:id', authMiddleware, upload.single('avatar'), AuthController.updateUser);

export default route;