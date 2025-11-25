import express from 'express';
import type { Request, Response } from 'express';

const router = express.Router();

import { chatController } from './controllers/chat.controller';

router.post('/api/chat', chatController.sendMessage);
router.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello world!',
   });
});

router.get('/', (req: Request, res: Response) => {
   res.send(`OPENAI_AI_KEY:${process.env.OPENAI_API_KEY}`);
});

export default router;
