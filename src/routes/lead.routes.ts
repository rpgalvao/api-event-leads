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

route.patch('/:id/card', upload.single('card'), LeadController.uploadCard);

route.put('/:id', LeadController.updateLead);

route.delete('/:id', LeadController.removeLead);

export default route;