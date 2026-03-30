import { Router } from "express";
import * as EventController from "../controllers/event.controller";
import { is } from "../middlewares/ensureAdmin";

const route = Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento (Apenas Admin)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Feira Hospitalar 2026"
 *               location:
 *                 type: string
 *                 example: "São Paulo Expo"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-20T09:00:00Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-05-24T18:00:00Z"
 *     responses:
 *       201:
 *         description: Evento criado com sucesso
 *       400:
 *         description: Erro de validação nos dados (Zod)
 *       401:
 *         description: Token ausente ou inválido
 *       403:
 *         description: Usuário sem permissão de administrador
 */
route.post('/', is(['ADMIN']), EventController.createEvent);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lista todos os eventos cadastrados
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos retornada com sucesso
 */
route.get('/', EventController.listEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Detalhes de um evento específico
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Dados do evento encontrados
 *       404:
 *         description: Evento não encontrado
 */
route.get('/:id', EventController.getEvent);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza dados de um evento
 *     tags: [Events]
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
 *               location:
 *                 type: string
 *               start_date:
 *                 type: string
 *               end_date:
 *                 type: string
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       404:
 *         description: Evento não encontrado
 */
route.put('/:id', EventController.updateEvent);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento (se não houver leads)
 *     tags: [Events]
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
 *         description: Evento removido com sucesso
 *       400:
 *         description: Erro de integridade (Existem leads vinculados)
 *       404:
 *         description: Evento não encontrado
 */
route.delete('/:id', EventController.deleteEvent);

export default route;