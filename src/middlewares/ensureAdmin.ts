import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export function is(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) throw new AppError('Usuário não atutorizado', 401);
        const { role } = req.user;
        if (!roles.includes(role)) throw new AppError('Não autorizado', 403);
        return next();
    };
}