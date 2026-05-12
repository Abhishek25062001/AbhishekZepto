import { Router } from 'express';
import { databaseWriteCheckController } from '../controllers/system-check.controller';

const router = Router();

router.post('/database-write-check', databaseWriteCheckController);

export default router;
