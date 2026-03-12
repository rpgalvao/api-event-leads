import { Router } from "express";
import authRoutes from './auth.routes';
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// health check
router.get('/ping', (req, res) => {
    res.status(200).json({ pong: true });
});

// arquivos de rotas independentes
router.use('/auth', authRoutes);

// rotas protegidas
router.use(authMiddleware);

// private health check
router.get('/private-ping', (req, res) => {
    res.status(200).json({ pong: true });
});

export default router;