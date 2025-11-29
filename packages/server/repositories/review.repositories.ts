import { PrismaClient, type Review, type Sumarry } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();
export const reviewRepositories = {
   getReviews: async (
      productId: string,
      limit: number = 10
   ): Promise<Review[]> => {
      const reviews = await prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
      return reviews;
   },
   storeeReviewSummary: async (productId: string, summary: string) => {
      const now = new Date();
      const expiresAt = dayjs(now).add(7, 'days').toDate();
      const data = {
         productId,
         content: summary,
         generatedAt: now,
         expiresAt: expiresAt,
      };
      await prisma.sumarry.upsert({
         where: { productId },
         update: data,
         create: data,
      });
   },
};
