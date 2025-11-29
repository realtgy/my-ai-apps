import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productRepositories = {
   getProduct: (id: string) => {
      return prisma.product.findUnique({
         where: { id },
      });
   },
};
