import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';
import { reviewController } from './controllers/review.controller';
const router = express.Router();

router.post('/api/chat', chatController.sendMessage);
router.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello world!',
   });
});

router.get('/', (req: Request, res: Response) => {
   res.send(`OPENAI_AI_KEY:${process.env.OPENAI_API_KEY}`);
});

router.get('/api/products/:id/reviews', reviewController.getReviews);

export default router;
