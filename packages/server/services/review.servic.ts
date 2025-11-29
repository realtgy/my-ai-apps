import { reviewRepositories } from '../repositories/review.repositories';
import { llmClient } from '../llm/client';
import summarizeReviewsPrompt from '../llm/prompts/sumarize-reviews.txt';

export const reviewService = {
   /**
    * Summarize the reviews for a given product ID, if the summary is not found,
    * generate a new summary from the latest 10 reviews
    * and store the summary in the database.
    * @param productId - The ID of the product
    * @returns The summary of the reviews
    */
   summarizeReviews: async (productId: string): Promise<string> => {
      const existingSummary =
         await reviewRepositories.getReviewSummary(productId);
      if (existingSummary) {
         return existingSummary;
      }

      const reviews = await reviewRepositories.getReviews(productId, 10);
      const reviewContent = reviews.map((r) => r.content).join('\n');
      // const prompt = summarizeReviewsPrompt.replace(
      //    '{{reviews}}',
      //    reviewContent
      // );
      // const summary = await llmClient.generateText({ prompt });
      const summary = await llmClient.generateSummaryFormReviews(
         reviewContent,
         summarizeReviewsPrompt
      );
      await reviewRepositories.storeeReviewSummary(productId, summary);
      return summary;
   },
};
