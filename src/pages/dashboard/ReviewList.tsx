import React, { useState, useEffect } from 'react';
import { reviewService } from '@/services/review.service';
import { Review } from '@/types';
import PageHeader from '@/components/dashboard/PageHeader';
import DataTable from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import { Star, Calendar } from 'lucide-react';

const ReviewList: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const data = await reviewService.listReviews();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (review: Review) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'fill-accent text-accent' : 'text-neutral-200 dark:text-neutral-700'}`}
          />
        ))}
      </div>
    );
  };

  const columns = [
    {
      key: 'rating' as keyof Review,
      label: 'Rating',
      render: (value: number) => renderStars(value),
    },
    {
      key: 'comment' as keyof Review,
      label: 'Comment',
      render: (value: string) => (
        <div className="text-neutral-600 dark:text-neutral-400 italic text-sm truncate max-w-xs">{value || 'No comment provided'}</div>
      ),
    },
    {
      key: 'createdAt' as keyof Review,
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-12 h-12 border-4 border-neutral-100 dark:border-neutral-800 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Customer Reviews"
        subtitle="Manage and analyze shop feedback"
        action={
          <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl px-5 py-2.5 shadow-sm">
            <div className="flex items-center gap-1.5 border-r border-neutral-100 dark:border-neutral-800 pr-4">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span className="text-neutral-900 dark:text-white font-black text-lg">{averageRating}</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Average</span>
            </div>
            <div className="pl-1">
              <span className="text-neutral-900 dark:text-white font-bold">{reviews.length}</span>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest ml-1.5">Reviews</span>
            </div>
          </div>
        }
      />

      <DataTable
        columns={columns}
        data={reviews}
        onRowClick={handleView}
        searchable
        searchPlaceholder="Search reviews..."
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Review Feedback">
        {selectedReview && (
          <div className="space-y-6">
            <div className="p-8 bg-accent-light/30 dark:bg-accent/5 rounded-3xl border border-accent/10 text-center">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${star <= selectedReview.rating ? 'fill-accent text-accent shadow-accent/20' : 'text-neutral-200 dark:text-neutral-800'}`}
                  />
                ))}
              </div>
              <div className="text-4xl font-black text-neutral-900 dark:text-white mb-2">{selectedReview.rating}.0</div>
              <div className="text-xs font-bold text-accent uppercase tracking-[0.2em]">Overall Rating</div>
            </div>

            <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
              <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">Customer's Comment</div>
              <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed italic text-lg font-serif">
                "{selectedReview.comment || 'No comment provided by the customer.'}"
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Customer ID</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{selectedReview.customerId}</div>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                <div className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-1">Barber ID</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-white font-mono">{selectedReview.barberId}</div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                {new Date(selectedReview.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div>ID: {selectedReview.id}</div>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold rounded-2xl transition-all active:scale-[0.98]"
            >
              Back to Reviews
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewList;
