import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, MessageSquare } from 'lucide-react';
import { reviewService } from '@/services/review.service';

interface ReviewFormProps {
  bookingId: number;
  onReviewSubmitted?: () => void;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ bookingId, onReviewSubmitted }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const rating = watch('rating');

  const onSubmit = async (data: ReviewFormData) => {
    if (data.rating === 0) {
      setMessage('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    
    try {
      await reviewService.createReview({
        bookingId,
        rating: data.rating,
        comment: data.comment,
      });
      
      setMessage('Thank you for your review!');
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Leave a Review</h3>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${
          message.includes('Thank you') 
            ? 'bg-green-50 text-green-600 border border-green-100' 
            : 'bg-red-50 text-red-600 border border-red-100'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-all"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setValue('rating', star)}
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredStar || rating)
                      ? 'fill-accent text-accent'
                      : 'fill-transparent text-neutral-300 dark:text-neutral-600'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-xs text-red-500 mt-1">{errors.rating.message}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Comment (optional)
          </label>
          <textarea
            {...register('comment')}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent dark:bg-neutral-800 resize-none"
            placeholder="Share your experience..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-accent hover:bg-accent-hover disabled:bg-neutral-200 dark:disabled:bg-neutral-800 text-white font-medium rounded-xl transition-all disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};
