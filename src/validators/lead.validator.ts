import z from "zod";

export const insertLeadSchema = z.object({
    name: z.string().min(2, 'O nome precisa ter pelo menos 2 caracteres'),
    email: z.email('E-mail inválido').optional().nullable(),
    phone: z.string().min(11, 'Numero de telefone inválido. Mínimo 11 caracteres'),
    company: z.string().optional(),
    city: z.string().optional(),
    state: z.string().min(2, 'Use a sigla do estado (ex: SP)').max(2, 'Use a sigla do estado (ex: SP)').optional(),
    observation: z.string().optional(),
    eventId: z.uuid('ID do evento inválida'),
    interests: z.array(z.uuid()).min(1, 'Selecione ao menos um produto de interesse')
});

export const updateLeadSchema = z.object({
    name: z.string().min(2, 'O nome precisa ter pelo menos 2 caracteres').optional(),
    email: z.email('E-mail inválido').optional().nullable(),
    phone: z.string().min(11, 'Numero de telefone inválido. Mínimo 11 caracteres').optional(),
    company: z.string().optional(),
    city: z.string().optional(),
    state: z.string().min(2, 'Use a sigla do estado (ex: SP)').max(2, 'Use a sigla do estado (ex: SP)').optional(),
    observation: z.string().optional(),
    eventId: z.uuid('ID do evento inválida').optional(),
    interests: z.array(z.uuid()).min(1, 'Selecione ao menos um produto de interesse').optional()
});

export const getLeadIdSchema = z.object({
    id: z.uuid()
});