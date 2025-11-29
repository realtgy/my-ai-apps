import { OpenAI } from 'openai';

const client = new OpenAI({
   apiKey: process.env.POE_API_KEY,
   baseURL: 'https://api.poe.com/v1',
});

type GenerateTextOptions = {
   model?: string;
   prompt: string;
   temperature?: number;
   maxTokens?: number;
};

export const llmClient = {
   generateText: async (options: GenerateTextOptions) => {
      const { model, prompt, temperature, maxTokens } = options;
      const chat = await client.chat.completions.create({
         model: model || 'gpt-5-mini',
         messages: [{ role: 'user', content: prompt }],
         temperature: temperature || 0.2,
         max_completion_tokens: maxTokens || 500,
      });
      return chat?.choices[0]?.message?.content || '';
   },
};
