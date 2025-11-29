import axios from 'axios';
import { useState, useEffect } from 'react';
import StarRating from './StarRating';
import Skeleton from 'react-loading-skeleton';

type ReviwListProps = {
   productId: string;
};

type Review = {
   id: string;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

const ReviewList = ({ productId }: ReviwListProps) => {
   const [reviewData, setReviewData] = useState<GetReviewsResponse>();
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string>('');
   useEffect(() => {
      const fetchReviews = async () => {
         try {
            setIsLoading(true);
            const { data } = await axios.get<GetReviewsResponse>(
               `/api/products/${productId}/reviewws`
            );
            setReviewData(data);
         } catch (err) {
            // TODO: log to sentry
            console.error(err);
            setError('Failed to fetch reviews');
         } finally {
            setIsLoading(false);
         }
      };
      fetchReviews();
   }, [productId]);

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((p) => (
               <div key={p}>
                  <Skeleton width={150} />
                  <Skeleton width={100} />
                  <Skeleton count={2} />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex flex-col gap-5">
            <div className="text-red-500">{error}</div>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>
                  Rating: <StarRating value={review.rating} />
               </div>
               <div className="py-2">{review.content}</div>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
