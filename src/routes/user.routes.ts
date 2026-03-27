import { Router } from "express";
import multer from "multer";
import { authoryzeByRole } from "../middlewares/role.middleware";
import { uploadConfig } from "../libs/multer";
import * as AuthController from "../controllers/auth.controller";
import * as UserController from "../controllers/user.controller";

const route = Router();
const upload = multer(uploadConfig);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários (Apenas Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *       403:
 *         description: Usuário sem permissão (Não é ADMIN)
 *       401:
 *         description: Token ausente ou inválido
 */
route.get('/', UserController.listUsers);
route.post('/', authoryzeByRole, AuthController.registerUser);
route.get('/me', UserController.getProfile);
route.put('/:id', upload.single('avatar'), UserController.updateUser);
route.delete('/:id', UserController.removeUser);

export default route;