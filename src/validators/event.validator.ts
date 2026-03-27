import z from "zod";

export const createEventSchema = z.object({
    name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
    location: z.string().optional(),
    start_date: z.string().datetime({ message: "Data de início inválida" }),
    end_date: z.string().datetime({ message: "Data de término inválida" }),
});

export const getEventSchema = z.object({
    id: z.uuid('ID informado em formato inválido')
});