import { Router } from "express";
import * as LeadController from "../controllers/lead.controller";
import multer from "multer";
import { uploadConfig } from "../libs/multer";

const route = Router();
const upload = multer(uploadConfig);

/**
 * @swagger
 * /leads:
 *   post:
 *     summary: Captura um novo lead na feira
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, eventId, interests]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "João Silva"
 *               email:
 *                 type: string
 *                 example: "joao@empresa com"
 *               phone:
 *                 type: string
 *                 example: "11999998888"
 *               eventId:
 *                 type: string
 *                 example: "uuid-do-evento"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["uuid-produto-1", "uuid-produto-2"]
 *     responses:
 *       201:
 *         description: Lead capturado com sucesso
 *       400:
 *         description: Dados inválidos ou produtos inexistentes
 *       401:
 *         description: Não autenticado
 */
route.post('/', LeadController.createLead);

/**
 * @swagger
 * /leads:
 *   get:
 *     summary: Lista leads com filtros opcionais
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventId
 *         schema:
 *           type: string
 *         description: Filtrar por um evento específico
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filtrar por um vendedor específico
 *     responses:
 *       200:
 *         description: Lista de leads retornada com sucesso
 */
route.get('/', LeadController.listLeads);

/**
 * @swagger
 * /leads/{id}/card:
 *   patch:
 *     summary: Faz o upload da foto do cartão de visita
 *     tags: [Leads]
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
 *               card:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagem processada com sucesso
 */

/**
 * @swagger
 * /leads/{id}:
 *   put:
 *     summary: Atualiza informações de texto do lead
 *     tags: [Leads]
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
 *               company:
 *                 type: string
 *               observation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Lead atualizado com sucesso
 */

/**
 * @swagger
 * /leads/{id}:
 *   delete:
 *     summary: Remove um lead e sua imagem do sistema
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Lead removido com sucesso
 */
route.patch('/:id/card', upload.single('card'), LeadController.uploadCard);
route.get('/:id', LeadController.getLead);
route.put('/:id', LeadController.updateLead);

route.delete('/:id', LeadController.removeLead);

export default route;