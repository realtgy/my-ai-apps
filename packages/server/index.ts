import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const schema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt must be less than 1000 characters'),
   conversationId: z
      .string()
      .trim()
      .uuid('Conversation ID must be a valid UUID')
      .optional(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = schema.safeParse(req.body);
   if (!parseResult.success) {
      return res.status(400).json({ parseResult: parseResult.error.format() });
   }
   const { conversationId, prompt } = req.body;
   try {
      const assistantContent = await chatService.sendMessage(
         conversationId,
         prompt
      );
      res.json({ message: assistantContent });
   } catch (error) {
      console.error('Error in chat API:', error);
      return res.status(500).json({ error: 'Internal server error' });
   }
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({
      message: 'Hello world!',
   });
});

app.get('/', (req: Request, res: Response) => {
   res.send(`OPENAI_AI_KEY:${process.env.OPENAI_API_KEY}`);
});

app.listen(port, () => {
   console.log(`http://localhost:${port}`);
});
