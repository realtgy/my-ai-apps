import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { chatController } from './controllers/chat.controller';

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

router.get('/api/products/:id/reviews', async (req: Request, res: Response) => {
   const { id } = req.params;
   const prisma = new PrismaClient();
   const reviews = await prisma.review.findMany({
      where: {
         productId: id,
      },
      orderBy: {
         createdAt: 'desc',
      },
   });
   await prisma.$disconnect();
   res.json(reviews);
});

export default router;
