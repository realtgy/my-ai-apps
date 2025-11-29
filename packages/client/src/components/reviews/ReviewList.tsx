import axios from 'axios';
import { useState, useEffect } from 'react';

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
   useEffect(() => {
      const fetchReviews = async () => {
         const { data } = await axios.get<GetReviewsResponse>(
            `/api/products/${productId}/reviews`
         );
         setReviewData(data);
      };
      fetchReviews();
   }, [productId]);
   return (
      <div className="flex flex-col gap-5">
         {reviewData?.reviews.map((review) => (
            <div key={review.id}>
               <div className="font-semibold">{review.author}</div>
               <div>Rating: {review.rating}/5</div>
               <div className="py-2">{review.content}</div>
            </div>
         ))}
      </div>
   );
};

export default ReviewList;
