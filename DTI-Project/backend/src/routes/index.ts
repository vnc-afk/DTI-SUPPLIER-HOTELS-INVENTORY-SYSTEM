import { Router } from 'express';
import authRoutes from './auth';
import apiRoutes from './api';

const router = Router();

router.use('/auth', authRoutes);
router.use('/', apiRoutes);

export default router;

