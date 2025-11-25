import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import z from 'zod';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new OpenAI({
   apiKey: process.env.POE_API_KEY,
   baseURL: 'https://api.poe.com/v1',
});

const conversations: Map<
   string,
   { role: 'user' | 'assistant'; content: string }[]
> = new Map();

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

   try {
      const { conversationId, prompt } = req.body;
      const history = conversations.get(conversationId) || [];
      const userMessage = { role: 'user' as const, content: prompt };
      const messages = [...history, userMessage];
      const chat = await client.chat.completions.create({
         model: 'gpt-5-mini121231233123',
         temperature: 0.2,
         max_completion_tokens: 200,
         messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
         })),
      });

      const assistantContent = chat?.choices[0]?.message?.content || '';
      const assistantMessage = {
         role: 'assistant' as const,
         content: assistantContent,
      };
      conversations.set(conversationId, [...messages, assistantMessage]);
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
