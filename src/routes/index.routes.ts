import { Router } from "express";
import authRoutes from './auth.routes';

const router = Router();

// health check
router.get('/ping', (req, res) => {
    res.status(200).json({ pong: true });
});

// arquivos de rotas independentes
router.use('/auth', authRoutes);

export default router;