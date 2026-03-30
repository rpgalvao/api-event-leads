import { appendFile } from "node:fs";
import { AppError } from "../errors/AppError";
import { Prisma } from "../generated/prisma/client";
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

export const updateEvent = async (id: string, data: Prisma.EventUpdateInput) => {
    const event = prisma.event.update({
        where: { id },
        data
    });
    if (!event) throw new AppError('Erro ao atualizar evento', 400);
    return event;
};

export const removeEvent = async (id: string) => {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    leads: true
                }
            }
        }
    });
    if (!event) throw new AppError('Evento não encontrado', 404);
    if (event._count.leads > 0) throw new AppError('Não é possível excluir eventos com leads cadastrados', 400);

    await prisma.event.delete({ where: { id } });
};