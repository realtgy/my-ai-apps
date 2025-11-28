import type { Request, Response } from 'express';
import { reviewService } from '../services/review.servic';

export const reviewController = {
   getReviews: async (req: Request, res: Response) => {
      const { id } = req.params;
      if (!id) {
         return res.status(400).json({ error: 'Product ID is required' });
      }
      const reviews = await reviewService.getReviews(id as string);
      res.json(reviews);
   },
};
