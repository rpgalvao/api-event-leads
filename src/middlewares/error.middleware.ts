import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorMiddleware = (
    error: Error & { statusCode?: number; },
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // 1. Zod validation errors
    if (error instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Dados informados inválidos.',
            errors: error.flatten().fieldErrors
        });
    }

    // 2. Erros personalizados ou de negócio
    const statusCode = error.statusCode ?? 500;
    const message = error.statusCode ? error.message : 'Erro interno no servidor.';

    console.error(`[Error] ${req.method} ${req.url} - ${error.message}`);

    return res.status(statusCode).json({ success: false, message });
};