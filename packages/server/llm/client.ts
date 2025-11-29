import { OpenAI } from 'openai';
import { InferenceClient } from '@huggingface/inference';

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const openAIClient = new OpenAI({
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
      const chat = await openAIClient.chat.completions.create({
         model: model || 'gpt-5-mini',
         messages: [{ role: 'user', content: prompt }],
         temperature: temperature || 0.2,
         max_completion_tokens: maxTokens || 500,
      });
      return chat?.choices[0]?.message?.content || '';
   },
   summarizeText: async (text: string) => {
      const output = await inferenceClient.summarization({
         model: 'facebook/bart-large-cnn',
         inputs: text,
         provider: 'hf-inference',
      });
      return output.summary_text || '';
   },
   generateSummaryFormReviews: async (prompt: string, systemPrompt: string) => {
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: systemPrompt,
            },
            {
               role: 'user',
               content: prompt,
            },
         ],
      });
      return chatCompletion?.choices[0]?.message?.content || '';
   },
};
