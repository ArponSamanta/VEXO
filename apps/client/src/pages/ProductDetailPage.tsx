import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiStar, HiOutlineHeart, HiOutlineShoppingBag, HiOutlinePlus, HiOutlineMinus, HiTrash } from 'react-icons/hi';
import api from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

const formatPrice = (p: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function ProductDetailPage() {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { setCart, openCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  // Review states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/slug/${slug}`).then(r => r.data.data),
    enabled: !!slug,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', product?._id],
    queryFn: () => api.get(`/products/${product._id}/reviews`).then(r => r.data.data),
    enabled: !!product?._id,
  });

  const addToCartMutation = useMutation({
    mutationFn: () => api.post('/cart', { productId: product._id, quantity }),
    onSuccess: (res) => { setCart(res.data.data); openCart(); toast.success('Added to cart!'); },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed'),
  });

  const addReviewMutation = useMutation({
    mutationFn: (newReview: { rating: number; title: string; comment: string }) =>
      api.post(`/products/${product._id}/reviews`, newReview),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', product?._id] });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
      setTitle('');
      setComment('');
      setRating(5);
      toast.success('Review submitted successfully!');
    },
    onError: (e: any) => {
      const errData = e.response?.data;
      if (errData?.details && Array.isArray(errData.details)) {
        toast.error(errData.details.join(', '));
      } else {
        toast.error(errData?.error || 'Failed to submit review');
      }
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: string) => api.delete(`/reviews/${reviewId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', product?._id] });
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
      toast.success('Review deleted');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed to delete review'),
  });

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to write a review');
      return;
    }
    if (!title || title.trim().length < 2) {
      toast.error('Headline must be at least 2 characters long');
      return;
    }
    if (!comment || comment.trim().length < 3) {
      toast.error('Detailed feedback must be at least 3 characters long');
      return;
    }
    addReviewMutation.mutate({ rating, title: title.trim(), comment: comment.trim() });
  };

  if (isLoading) {
    return (
      <div className="page-container py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-vexo-bg-secondary rounded-2xl animate-pulse" />
          <div className="space-y-4">
            <div className="h-4 bg-vexo-bg-secondary rounded w-1/4" />
            <div className="h-8 bg-vexo-bg-secondary rounded w-3/4" />
            <div className="h-6 bg-vexo-bg-secondary rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="page-container py-20 text-center text-vexo-text-muted">Product not found</div>;

  const discount = product.comparePrice ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0;
  
  const hasReviewed = reviews?.some((r: any) => r.user?._id === user?._id || r.user === user?._id);

  return (
    <div className="page-container py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-vexo-bg-secondary mb-4">
            <img src={product.images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            {discount > 0 && <span className="absolute top-4 left-4 badge-sale text-sm">-{discount}%</span>}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img: string, i: number) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? 'border-vexo-blue shadow-glow-blue' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <p className="text-vexo-text-muted text-sm uppercase tracking-wider">{product.category} · {product.brand}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mt-2">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex">{[...Array(5)].map((_, i) => <HiStar key={i} size={20} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-vexo-text-muted/30'} />)}</div>
            <span className="text-vexo-text-secondary">{product.rating} ({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold gradient-text">{formatPrice(product.price)}</span>
            {product.comparePrice && <span className="text-xl text-vexo-text-muted line-through">{formatPrice(product.comparePrice)}</span>}
            {discount > 0 && <span className="badge-sale">{discount}% OFF</span>}
          </div>

          <p className="text-vexo-text-secondary leading-relaxed">{product.description}</p>

          {/* Stock */}
          <p className={`text-sm font-medium ${product.stock > 0 ? 'text-vexo-green' : 'text-vexo-pink'}`}>
            {product.stock > 0 ? `✓ In Stock (${product.stock} available)` : '✕ Out of Stock'}
          </p>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center glass-card">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-vexo-glass transition-colors"><HiOutlineMinus size={18} /></button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-vexo-glass transition-colors"><HiOutlinePlus size={18} /></button>
            </div>
            <button onClick={() => {
              if (!isAuthenticated) { toast.error('Please sign in'); return; }
              addToCartMutation.mutate();
            }} disabled={product.stock === 0} className="btn-primary flex-1 flex items-center justify-center gap-2 py-4">
              <HiOutlineShoppingBag size={20} /> Add to Cart
            </button>
            <button className="p-4 glass-card-hover"><HiOutlineHeart size={20} /></button>
          </div>

          {/* Specs */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="glass-card p-6 mt-6">
              <h3 className="font-heading font-semibold mb-4">Specifications</h3>
              <dl className="grid grid-cols-2 gap-3">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key}>
                    <dt className="text-xs text-vexo-text-muted">{key}</dt>
                    <dd className="text-sm font-medium">{val as string}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reviews */}
      <section className="mt-20 border-t border-vexo-border pt-16">
        <h2 className="section-heading mb-10 text-2xl md:text-3xl">Customer Reviews</h2>
        
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Submit Review Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-heading font-bold text-lg mb-4">
                {hasReviewed ? 'Your Review' : 'Write a Review'}
              </h3>
              
              {!isAuthenticated ? (
                <div className="text-center py-4">
                  <p className="text-sm text-vexo-text-secondary mb-4">Please sign in to share your rating and review for this product.</p>
                  <p className="text-xs text-vexo-text-muted">You will be able to select a star rating, add a headline, and write feedback.</p>
                </div>
              ) : hasReviewed ? (
                <div className="space-y-4">
                  <p className="text-sm text-vexo-green font-medium">✓ You have already reviewed this product!</p>
                  <p className="text-xs text-vexo-text-secondary">If you want to change your feedback, you can delete your current review and submit a new one.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-vexo-text-secondary">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className="focus:outline-none transition-transform hover:scale-110"
                          onClick={() => setRating(num)}
                          onMouseEnter={() => setHoverRating(num)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <HiStar
                            size={28}
                            className={
                              num <= (hoverRating || rating)
                                ? 'text-yellow-400'
                                : 'text-vexo-text-muted/30'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-vexo-text-secondary">Review Headline</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                      placeholder="Summarize your experience..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  {/* Comment */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-vexo-text-secondary">Detailed Feedback</label>
                    <textarea
                      className="input-field h-28 resize-none"
                      required
                      placeholder="What did you like or dislike? How does it perform?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={addReviewMutation.isPending}
                    className="btn-primary w-full py-3"
                  >
                    {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {reviews && reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review: any) => (
                  <div key={review._id} className="glass-card p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-vexo flex items-center justify-center font-bold text-sm shrink-0 shadow-glow-blue/20">
                        {review.user?.name?.[0] || 'U'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-white text-sm">{review.user?.name || 'Customer'}</p>
                          <span className="text-xs text-vexo-text-muted">• {new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex my-1.5">
                          {[...Array(5)].map((_, i) => (
                            <HiStar
                              key={i}
                              size={14}
                              className={i < review.rating ? 'text-yellow-400' : 'text-vexo-text-muted/30'}
                            />
                          ))}
                        </div>
                        <h4 className="font-semibold text-sm text-white mt-1">{review.title}</h4>
                        <p className="text-sm text-vexo-text-secondary mt-1 leading-relaxed">{review.comment}</p>
                      </div>
                    </div>

                    {/* Delete review button (Admin or Owner only) */}
                    {user && (review.user?._id === user._id || review.user === user._id || user.role === 'admin' || user.role === 'superadmin') && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this review?')) {
                            deleteReviewMutation.mutate(review._id);
                          }
                        }}
                        className="text-vexo-pink hover:bg-vexo-pink/10 p-2.5 rounded-lg transition-all shrink-0 self-end md:self-start focus:outline-none"
                        title="Delete Review"
                      >
                        <HiTrash size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-12 text-center text-vexo-text-muted">
                <p className="text-base font-medium text-white mb-1">No reviews yet</p>
                <p className="text-sm">Be the first to review this product and share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
