import { AppError } from "../errors/AppError";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../libs/prisma";
import { StorageProvider } from "../providers/StorageProvider";
import { setFullURL } from "../utils/setFullUrl";

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

export const listLeads = async (filters: { eventId?: string, userId?: string; }) => {
    const leads = await prisma.lead.findMany({
        where: {
            eventId: filters.eventId,
            userId: filters.userId
        },
        include: {
            event: { select: { name: true } },
            user: { select: { name: true } },
            interests: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
    return leads;
};

export const updateLeadCard = async (leadId: string, filename: string) => {
    const storage = new StorageProvider();
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new AppError('Lead não encontrado', 404);
    if (lead.business_card_url) {
        await storage.deleteFile(lead.business_card_url, 'cards');
    }
    await storage.saveFile(filename, 'cards', 1024);
    const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: { business_card_url: filename },
        include: { interests: true }
    });

    updatedLead.business_card_url = setFullURL(`files/cards/${updatedLead.business_card_url}`);

    return updatedLead;
};

export const updateLead = async (id: string, data: Partial<LeadInput>) => {
    const leadExists = await prisma.lead.findUnique({ where: { id } });
    if (!leadExists) throw new AppError('Lead não encontrado', 404);
    try {
        const updatedLead = await prisma.lead.update({
            where: { id },
            data: data as any,
            include: { interests: true }
        });
        return updatedLead;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new AppError('Um ou mais produtos selecionados não existem no catálogo de produtos', 400);
            }
        }
        throw error;
    }
};

export const deleteLead = async (id: string) => {
    const storage = new StorageProvider();
    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) throw new AppError('Lead não encontrado', 404);
    console.log('Cartão: ', lead.business_card_url);
    if (lead.business_card_url) {
        await storage.deleteFile(lead.business_card_url, 'cards');
    }
    await prisma.lead.delete({ where: { id } });
};