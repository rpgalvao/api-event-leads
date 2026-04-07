import z from "zod";

export const registerUserSchema = z.object({
    name: z.string('O campo de nome é obrigatório').min(2, 'O campo nome deve ter no mínimo 2 caracteres').max(255),
    email: z.email('E-mail informado não é válido'),
    password: z.string('O campo de senha é obrigatório').min(5, 'A senha deve conter pelo menos 5 caracteres')
});

export const loginUserSchema = z.object({
    email: z.email('O e-mail informado não é válido'),
    password: z.string('O campo de senha é obrigatório').min(5, 'A senha deve conter pelo menos 5 caracteres')
});

export const updateUserSchema = z.object({
    name: z.string('O campo de nome é obrigatório').min(2, 'O campo nome deve ter no mínimo 2 caracteres').max(255).optional(),
    email: z.email('E-mail informado não é válido').optional(),
    password: z.string('O campo de senha é obrigatório').min(5, 'A senha deve conter pelo menos 5 caracteres').optional(),
    role: z.enum(['ADMIN', 'USER']),
    avatar_url: z.string().optional()
});

export const getUserSchema = z.object({
    id: z.uuid()
});