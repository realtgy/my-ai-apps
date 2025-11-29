import type { Review } from '@prisma/client';
import { reviewRepositories } from '../repositories/review.repositories';
import { OpenAI } from 'openai';

const client = new OpenAI({
   apiKey: process.env.POE_API_KEY,
   baseURL: 'https://api.poe.com/v1',
});

export const reviewService = {
   getReviews: async (productId: string): Promise<Review[]> => {
      const reviews = await reviewRepositories.getReviews(productId);
      return reviews;
   },
   /**
    * Summarize the reviews for a given product ID
    * @param productId - The ID of the product
    * @returns The summary of the reviews
    */
   summarizeReviews: async (productId: string): Promise<string> => {
      const reviews = await reviewRepositories.getReviews(productId, 10);
      const reviewContent = reviews.map((r) => r.content).join('\n');
      const prompt = `Summarize the following reviews for a given reviews: ${reviewContent}.
      Highlight the key theme, both positive and negative.
      `;
      const chat = await client.chat.completions.create({
         model: 'gpt-5-mini',
         messages: [{ role: 'user', content: prompt }],
         temperature: 0.2,
         max_completion_tokens: 500,
      });
      const summary = chat?.choices[0]?.message?.content || '';
      return summary;
   },
};
