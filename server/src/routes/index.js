import { Router } from 'express';
import healthCheck from './health-check.js';
import authRouter from './auth.js';
import apiRouter from './api.js';

const router = Router();

export default () => {
    router.get('/health', healthCheck);
    router.use('/api/auth', authRouter);
    router.use('/api', apiRouter);

    return router;
};