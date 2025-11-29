import type { Request, Response } from 'express';
import { productRepositories } from '../repositories/product.repositories';
import { reviewRepositories } from '../repositories/review.repositories';
import { reviewService } from '../services/review.servic';

export const reviewController = {
   getReviews: async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({ error: 'Product ID is required' });
      }
      const reviews = await reviewRepositories.getReviews(id as string);
      const summary = await reviewService.summarizeReviews(id as string);
      res.json({ reviews, summary });
   },
   summarizeReviews: async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({ error: 'Product ID is required' });
      }
      const product = await productRepositories.getProduct(id as string);
      if (!product) {
         return res.status(500).json({ error: 'Invalid product ID' });
      }

      const reviews = await reviewRepositories.getReviews(id as string, 1);
      if (reviews.length === 0) {
         return res
            .status(400)
            .json({ error: 'No reviews found for this product' });
      }

      const summary = await reviewService.summarizeReviews(id as string);
      res.json({ summary });
   },
};
