import type { Review } from '@prisma/client';
import { reviewRepositories } from '../repositories/review.repositories';
export const reviewService = {
   getReviews: async (productId: string): Promise<Review[]> => {
      const reviews = await reviewRepositories.getReviews(productId);
      return reviews;
   },
};
