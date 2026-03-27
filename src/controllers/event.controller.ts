import { RequestHandler } from "express";
import * as EventService from "../services/event.service";
import { createEventSchema, getEventSchema } from "../validators/event.validator";

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