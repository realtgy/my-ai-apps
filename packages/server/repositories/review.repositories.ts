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
   /**
    * query the valid summary for a given product ID
    * @param productId - the ID of the product
    * @returns the summary or null if no valid summary is found
    */
   getReviewSummary: async (productId: string): Promise<string | null> => {
      const summary = await prisma.sumarry.findFirst({
         where: { AND: [{ productId }, { expiresAt: { gt: new Date() } }] },
      });
      return summary?.content ?? null;
   },
};
