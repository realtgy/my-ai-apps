import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const client = new OpenAI({
   apiKey: process.env.POE_API_KEY,
   baseURL: 'https://api.poe.com/v1',
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt } = req.body;
   const chat = await client.chat.completions.create({
      model: 'gemini-3-pro',
      messages: [{ role: 'user', content: prompt }],
   });
   res.json({
      message: chat?.choices[0]?.message?.content,
   });
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
