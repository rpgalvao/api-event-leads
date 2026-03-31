import { Router } from "express";
import * as ProductController from "../controllers/product.controller";
import { is } from "../middlewares/ensureAdmin";
const route = Router();

/**
 * @swagger
 * tags:
 * name: Products
 * description: Gestão do catálogo de produtos e interesses
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Lista todos os produtos (Qualquer usuário logado)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *       401:
 *         description: Token ausente ou inválido
 *
 *   post:
 *     summary: Cadastra um novo produto (Apenas Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Equipamento de Raio-X Digital"
 *               description:
 *                 type: string
 *                 example: "Alta resolução para diagnósticos precisos"
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *       400:
 *         description: Erro de validação ou produto já existente
 *       403:
 *         description: Usuário sem permissão de administrador
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Detalhes de um produto específico
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto (93e7b0bb-94fe-4b52-88bc-1b367d95f04b)
 *     responses:
 *       200:
 *         description: Dados do produto encontrados
 *       404:
 *         description: Produto não encontrado
 *
 *   put:
 *     summary: Atualiza um produto (Apenas Admin)
 *     tags: [Products]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       403:
 *         description: Permissão negada
 *
 *   delete:
 *     summary: Remove um produto (Apenas Admin - Sem leads vinculados)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *       400:
 *         description: Não é possível deletar (Produto possui leads)
 */

route.post('/', is(['ADMIN']), ProductController.addProduct);
route.get('/', ProductController.listProducts);
route.get('/:id', ProductController.getProduct);
route.put('/:id', is(['ADMIN']), ProductController.updateProduct);
route.delete('/:id', is(['ADMIN']), ProductController.removeProduct);

export default route;