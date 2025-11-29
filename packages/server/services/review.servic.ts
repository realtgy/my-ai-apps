import type { Review } from '@prisma/client';
import { reviewRepositories } from '../repositories/review.repositories';
import { llmClient } from '../llm/client';
import summarizeReviewsPrompt from '../prompts/sumarize-reviews.txt';

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
      const prompt = summarizeReviewsPrompt.replace(
         '{{reviews}}',
         reviewContent
      );
      const summary = await llmClient.generateText({ prompt });
      await reviewRepositories.storeeReviewSummary(productId, summary);
      return summary;
   },
};
