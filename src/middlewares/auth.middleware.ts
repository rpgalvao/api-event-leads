import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../libs/jwt";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ success: false, message: 'Não autorizado!' });
    const [_, token] = authHeader.split(' ');
    if (!token) return res.status(401).json({ success: false, message: 'Não autorizado!' });
    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ success: false, message: 'Não autorizado!' });
    req.user = decoded;
    next();
};