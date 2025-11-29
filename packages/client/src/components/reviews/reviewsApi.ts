import axios from 'axios';

export type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

export type Review = {
   id: string;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

export type SummarizeResponse = {
   summary: string;
};

export const reviewsApi = {
   getReviews: async (productId: string): Promise<GetReviewsResponse> => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   },
   summarizeReviews: async (productId: string): Promise<SummarizeResponse> => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   },
};
