import { PrismaClient, type Review } from '@prisma/client';

export const reviewRepositories = {
   getReviews: async (
      productId: string,
      limit: number = 10
   ): Promise<Review[]> => {
      const prisma = new PrismaClient();
      const reviews = await prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
      return reviews;
   },
   // summarizeReviews: async (review: Review): Promise<Review> => {},
};
