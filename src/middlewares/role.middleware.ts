import { NextFunction, Request, Response } from "express";

export const authoryzeByRole = (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || userRole !== "ADMIN") {
        return res.status(403).json({ success: false, message: 'Usuário não autorizado' });
    }
    return next();
}; 