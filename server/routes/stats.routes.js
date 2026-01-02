import express from 'express';
import { getStatsController } from '../controllers/stats.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const statsRoutes = express.Router();

statsRoutes.get('/', protect, getStatsController);

export default statsRoutes;
