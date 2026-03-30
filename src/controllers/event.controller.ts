import { RequestHandler } from "express";
import * as EventService from "../services/event.service";
import { createEventSchema, getEventSchema, updateEventSchema } from "../validators/event.validator";
import { AppError } from "../errors/AppError";

export const createEvent: RequestHandler = async (req, res) => {
    const data = createEventSchema.parse(req.body);
    const { name, location, start_date, end_date } = data;
    const event = await EventService.createEvent({ name, location, start_date, end_date });
    res.status(201).json({ success: true, data: event });
};

export const listEvents: RequestHandler = async (req, res) => {
    const events = await EventService.getEvents();
    res.status(200).json({ success: true, data: events });
};

export const getEvent: RequestHandler = async (req, res) => {
    const { id } = getEventSchema.parse(req.params);
    const event = await EventService.getEventById(id);
    res.status(200).json({ success: true, data: event });
};

export const updateEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    if (!id) throw new AppError('Necessário informar o ID do evento', 400);
    const data = updateEventSchema.parse(req.body);
    const event = await EventService.updateEvent(id as string, data);
    res.status(200).json({ success: true, data: event });
};

export const deleteEvent: RequestHandler = async (req, res) => {
    const { id } = req.params;
    if (!id) throw new AppError('Necessário informar o ID do evento', 400);
    await EventService.removeEvent(id as string);
    res.status(200).json({ success: true, data: null });
};