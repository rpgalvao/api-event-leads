import { Router } from "express";
import multer from "multer";
import { authoryzeByRole } from "../middlewares/role.middleware";
import { uploadConfig } from "../libs/multer";
import * as AuthController from "../controllers/auth.controller";
import * as UserController from "../controllers/user.controller";

const route = Router();
const upload = multer(uploadConfig);

route.get('/users', UserController.listUsers);
route.post('/users', authoryzeByRole, AuthController.registerUser);
route.get('/users/me', UserController.getProfile);
route.put('/users/:id', upload.single('avatar'), UserController.updateUser);
route.delete('/users/:id', UserController.removeUser);

export default route;