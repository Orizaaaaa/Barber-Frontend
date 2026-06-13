import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, User, Scissors, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ReviewForm } from '@/components/ReviewForm';
import { bookingService } from '@/services/booking.service';
import { Booking } from '@/types';

const BookingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking(id);
    }
  }, [id]);

  const loadBooking = async (bookingId: string) => {
    try {
      const data = await bookingService.getBooking(Number(bookingId));
      setBooking(data);
    } catch (error) {
      console.error('Failed to load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'CONFIRMED':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400';
      case 'CANCELLED':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
      case 'CONFIRMED':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-neutral-300 dark:border-neutral-700 border-t-accent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">Booking not found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-accent hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Booking Details</h1>
        </div>

        {/* Booking Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden">
          {/* Status Bar */}
          <div className={`px-6 py-4 flex items-center gap-3 ${getStatusColor(booking.status)}`}>
            {getStatusIcon(booking.status)}
            <span className="font-semibold capitalize">{booking.status.toLowerCase()}</span>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Service Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Scissors className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Service</p>
                    <p className="font-semibold text-neutral-900 dark:text-white">{booking.service?.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Barber</p>
                    <p className="font-semibold text-neutral-900 dark:text-white">{booking.barber?.user?.name}</p>
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Date</p>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {new Date(booking.bookingDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Time</p>
                    <p className="font-semibold text-neutral-900 dark:text-white">
                      {booking.startTime} - {booking.endTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {booking.payment && (
              <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Payment</p>
                    <div className="flex items-baseline gap-2">
                      <p className="font-semibold text-neutral-900 dark:text-white">
                        Rp {booking.payment.finalAmount?.toLocaleString() || booking.payment.amount.toLocaleString()}
                      </p>
                      {booking.payment.discountAmount && booking.payment.discountAmount > 0 && (
                        <>
                          <span className="text-sm text-neutral-500 line-through">
                            Rp {booking.payment.amount.toLocaleString()}
                          </span>
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                            -Rp {booking.payment.discountAmount.toLocaleString()}
                          </span>
                        </>
                      )}
                    </div>
                    {booking.payment.promoCode && (
                      <p className="text-xs text-accent mt-1">Promo code: {booking.payment.promoCode}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.payment.status === 'PAID'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-yellow-100 text-yellow-600'
                    }`}>
                    {booking.payment.status}
                  </span>
                </div>
              </div>
            )}

            {/* Review Section */}
            {booking.status === 'COMPLETED' && !booking.review && (
              <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                {!showReviewForm ? (
                  <div className="text-center">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">How was your experience?</p>
                    <button
                      onClick={() => setShowReviewForm(true)}
                      className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-xl transition-all"
                    >
                      Leave a Review
                    </button>
                  </div>
                ) : (
                  <ReviewForm
                    bookingId={Number(booking.id)}
                    onReviewSubmitted={() => {
                      setShowReviewForm(false);
                      loadBooking(String(booking.id));
                    }}
                  />
                )}
              </div>
            )}

            {/* Existing Review */}
            {booking.review && (
              <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">Your Review</h3>
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`w-6 h-6 ${star <= (booking.review?.rating || 0)
                        ? 'fill-accent text-accent'
                        : 'fill-transparent text-neutral-300 dark:text-neutral-600'
                        }`}
                    >
                      ★
                    </div>
                  ))}
                </div>
                {booking.review?.comment && (
                  <p className="text-neutral-600 dark:text-neutral-400">{booking.review.comment}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
