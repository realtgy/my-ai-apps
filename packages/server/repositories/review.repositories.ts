import { PrismaClient, type Review } from '@prisma/client';

export const reviewRepositories = {
   getReviews: async (productId: string): Promise<Review[]> => {
      const prisma = new PrismaClient();
      const reviews = await prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
      });
      return reviews;
   },
   createReview: async (review: Review): Promise<Review> => {
      const prisma = new PrismaClient();
      const newReview = await prisma.review.create({
         data: review,
      });
      return newReview;
   },
};
