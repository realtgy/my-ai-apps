import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

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

export const chatController = {
   sendMessage: async (req: Request, res: Response) => {
      const parseResult = schema.safeParse(req.body);
      if (!parseResult.success) {
         return res
            .status(400)
            .json({ parseResult: parseResult.error.format() });
      }
      const { conversationId, prompt } = req.body;
      try {
         const response = await chatService.sendMessage(conversationId, prompt);
         res.json(response);
      } catch (error) {
         console.error('Error in chat API:', error);
         return res.status(500).json({ error: 'Internal server error' });
      }
   },
};
