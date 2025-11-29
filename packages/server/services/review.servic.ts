import { reviewRepositories } from '../repositories/review.repositories';
import { llmClient } from '../llm/client';
import summarizeReviewsPrompt from '../prompts/sumarize-reviews.txt';
import dayjs from 'dayjs';

export const reviewService = {
   /**
    * Summarize the reviews for a given product ID
    * @param productId - The ID of the product
    * @returns The summary of the reviews
    */
   summarizeReviews: async (productId: string): Promise<string> => {
      const existingSummary =
         await reviewRepositories.getReviewSummary(productId);
      if (
         existingSummary &&
         existingSummary.expiresAt &&
         dayjs(existingSummary.expiresAt).isAfter(dayjs())
      ) {
         return existingSummary.content;
      }

      const reviews = await reviewRepositories.getReviews(productId, 10);
      if (reviews.length === 0) {
         return 'No reviews found for this product';
      }

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
