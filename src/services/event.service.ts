import { AppError } from "../errors/AppError";
import { prisma } from "../libs/prisma";

interface EventRequest {
    name: string,
    location?: string,
    start_date: string,
    end_date: string;
}

export const createEvent = async ({ name, location, start_date, end_date }: EventRequest) => {
    const eventAlreadyExists = await prisma.event.findFirst({ where: { name } });
    if (eventAlreadyExists) throw new AppError('Já existe um evento cadaastrado com esse nome', 400);
    const event = await prisma.event.create({
        data: {
            name,
            location,
            start_date: new Date(start_date),
            end_date: new Date(end_date)
        }
    });
    return event;
};

export const getEvents = async () => {
    const events = await prisma.event.findMany({
        orderBy: { start_date: 'asc' }
    });
    return events;
};

export const getEventById = async (id: string) => {
    const event = await prisma.event.findFirst({
        where: { id }
    });

    if (!event) throw new AppError('Evento não encontrado', 404);
    return event;
};