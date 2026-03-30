import z from "zod";

export const addProductSchema = z.object({
    name: z.string('O nome do produto é obrigatório').min(2, 'O nome do produto deve conter pelo menos 2 caracteres'),
    description: z.string().optional()
});

export const getProductSchema = z.object({
    id: z.uuid('ID do produto está em formato inválido')
});

export const updateProductSchema = z.object({
    name: z.string('O nome do produto é obrigatório').min(2, 'O nome do produto deve conter pelo menos 2 caracteres').optional(),
    description: z.string().optional()
});