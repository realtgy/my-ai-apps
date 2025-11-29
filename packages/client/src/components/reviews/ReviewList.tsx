import axios from 'axios';
import StarRating from './StarRating';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { IoSparklesSharp } from 'react-icons/io5';
import { useState } from 'react';
import ReviewSkeleton from './ReviewSkeleton';

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

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: ReviwListProps) => {
   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };
   const {
      data: reviewData,
      isLoading,
      error,
      refetch,
   } = useQuery({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };
   const {
      mutate: handleSummarizeReviews,
      isPending: isSummarizing,
      error: summaryError,
      data: summarizeResponse,
   } = useMutation<SummarizeResponse>({
      mutationFn: () => summarizeReviews(),
   });

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((p) => (
               <div key={p}>
                  <ReviewSkeleton />
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex flex-col gap-5">
            <div className="text-red-500">
               Could not load reviews. Try again later.
            </div>
            <Button onClick={() => refetch()}>Try again</Button>
         </div>
      );
   }

   if (!reviewData?.reviews?.length) {
      return null;
   }

   const currentSummary = summarizeResponse?.summary || reviewData?.summary;

   return (
      <div>
         <div className="mb-5">
            {currentSummary ? (
               <p>{currentSummary}</p>
            ) : (
               <div>
                  <Button
                     onClick={() => handleSummarizeReviews()}
                     className="cursor-pointer"
                     disabled={isSummarizing}
                  >
                     <IoSparklesSharp />
                     Generate summary
                  </Button>
                  {isSummarizing ? <ReviewSkeleton /> : null}
                  {summaryError ? (
                     <div className="text-red-500">
                        Could not generate summary. Try again later.
                     </div>
                  ) : null}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews?.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     Rating: <StarRating value={review.rating} />
                  </div>
                  <div className="py-2">{review.content}</div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
