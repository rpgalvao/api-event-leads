import { RequestHandler } from "express";
import { getLeadIdSchema, insertLeadSchema, updateLeadSchema } from "../validators/lead.validator";
import * as LeadService from "../services/lead.service";
import { AppError } from "../errors/AppError";

export const createLead: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Usuário sem autorização', 401);
    const data = insertLeadSchema.parse(req.body);
    const lead = await LeadService.createLead({ ...data, userId });
    res.status(201).json({ success: true, data: lead });
};

export const listLeads: RequestHandler = async (req, res) => {
    if (!req.user) throw new AppError('Usuário não autenticado', 401);

    const { id: loggedUserId, role } = req.user;
    const { eventId, userId: targetUserId } = req.query;
    let finalUserId = targetUserId as string;

    if (role !== 'ADMIN') {
        finalUserId = loggedUserId;
    }
    const leads = await LeadService.listLeads({
        eventId: eventId as string,
        userId: finalUserId
    });
    res.status(200).json({ success: true, data: leads });
};

export const getLead: RequestHandler = async (req, res) => {
    const { id } = getLeadIdSchema.parse(req.params);
    const lead = await LeadService.getLeadById(id);
    res.status(200).json({ success: true, data: lead });
};

export const uploadCard: RequestHandler = async (req, res) => {
    const { id } = getLeadIdSchema.parse(req.params);
    const file = req.file;
    if (!file) throw new AppError('Nenhuma imagem enviada', 400);
    const lead = await LeadService.updateLeadCard(id as string, file.filename);
    res.status(200).json({ success: true, message: 'Cartão de visita processado com sucesso!', data: lead });
};

export const updateLead: RequestHandler = async (req, res) => {
    const { id } = getLeadIdSchema.parse(req.params);
    const data = updateLeadSchema.parse(req.body);
    const updatedLead = await LeadService.updateLead(id, data);
    res.status(200).json({ success: true, data: updatedLead });
};

export const removeLead: RequestHandler = async (req, res) => {
    const { id } = getLeadIdSchema.parse(req.params);
    await LeadService.deleteLead(id);
    res.status(200).json({ success: true, message: 'Lead removido com sucesso!' });
};