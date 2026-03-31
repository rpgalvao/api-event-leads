import { AppError } from "../errors/AppError";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";

interface LeadInput {
    name: string;
    email?: string | null;
    phone: string;
    company?: string;
    city?: string;
    state?: string;
    observation?: string;
    eventId: string;
    userId: string;
    interests: string[];
}

export const createLead = async (data: LeadInput) => {
    const eventExists = await prisma.event.findFirst({ where: { id: data.eventId } });
    if (!eventExists) throw new AppError('Evento não encontrado', 404);
    try {
        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company,
                city: data.city,
                state: data.state,
                observation: data.observation,
                eventId: data.eventId,
                userId: data.userId,
                interests: {
                    connect: data.interests.map(id => ({ id }))
                }
            },
            include: {
                interests: true,
                event: { select: { name: true } }
            }
        });

        return lead;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new AppError('Um ou mais produtos selecionados não existem no catálogo de produtos', 400);
            }
        }
        throw error;
    }
};