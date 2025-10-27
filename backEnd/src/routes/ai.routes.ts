import express from 'express';
import { aiApi } from '../controllers/ai.controller';
const router = express.Router();

router.post('/ai', aiApi);

export default router;
