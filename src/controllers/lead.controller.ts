import { RequestHandler } from "express";
import { insertLeadSchema } from "../validators/lead.validator";
import * as LeadService from "../services/lead.service";
import { AppError } from "../errors/AppError";

export const createLead: RequestHandler = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError('Usuário sem autorização', 401);
    const data = insertLeadSchema.parse(req.body);
    const lead = await LeadService.createLead({ ...data, userId });
    res.status(201).json({ success: true, data: lead });
};