import { Router } from "express";

const router = Router();

// health check
router.get('/ping', (req, res) => {
    res.status(200).json({ pong: true });
});

export default router;