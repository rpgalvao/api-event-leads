import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../middlewares/auth.middleware";
import { authoryzeByRole } from "../middlewares/role.middleware";
import { uploadConfig } from "../libs/multer";
import * as AuthController from "../controllers/auth.controller";
import * as UserController from "../controllers/user.controller";

const route = Router();
const upload = multer(uploadConfig);

route.get('/users', UserController.listUsers);
route.post('/users', authMiddleware, authoryzeByRole, AuthController.registerUser);
route.get('/users/me', authMiddleware, UserController.getProfile);
route.patch('/users/:id', authMiddleware, upload.single('avatar'), UserController.updateUser);

export default route;