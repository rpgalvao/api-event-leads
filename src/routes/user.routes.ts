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

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Registra um novo usuário (Apenas Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Renato Galvão"
 *               email:
 *                 type: string
 *                 example: "admin@rpgsistemas.com.br"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [ADMIN, VENDEDOR]
 *                 example: "VENDEDOR"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna os dados do usuário logado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil retornados com sucesso
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza dados e avatar do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 */
route.get('/', UserController.listUsers);
route.post('/', authoryzeByRole, AuthController.registerUser);
route.get('/me', UserController.getProfile);
route.put('/:id', upload.single('avatar'), UserController.updateUser);
route.delete('/:id', UserController.removeUser);

export default route;