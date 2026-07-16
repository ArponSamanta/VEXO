import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiOutlineShoppingBag, HiStar } from 'react-icons/hi';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    price: number;
    comparePrice?: number;
    rating: number;
    numReviews: number;
    category: string;
    featured: boolean;
  };
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isInWishlist?: boolean;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist }: ProductCardProps) {
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group glass-card overflow-hidden"
    >
      {/* Image & Quick Actions Wrapper */}
      <div className="relative overflow-hidden aspect-square bg-vexo-bg-tertiary">
        <Link
          to={`/products/${product.slug}`}
          className="block w-full h-full focus-visible:ring-2 focus-visible:ring-vexo-blue focus-visible:ring-offset-2 focus-visible:ring-offset-vexo-bg outline-none rounded-t-xl"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-vexo-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
          {discount > 0 && <span className="badge-sale">-{discount}%</span>}
          {product.featured && <span className="badge-featured">Featured</span>}
        </div>

        {/* Quick actions on hover/focus */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 translate-y-4 group-hover:translate-y-0 group-focus-within:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart?.(); }}
            className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-2"
            aria-label={`Add ${product.name} to cart`}
          >
            <HiOutlineShoppingBag size={16} /> Add to Cart
          </button>
          <button
            onClick={(e) => { e.preventDefault(); onToggleWishlist?.(); }}
            className={`p-2 rounded-lg border transition-all ${
              isInWishlist
                ? 'bg-vexo-pink/20 border-vexo-pink text-vexo-pink'
                : 'bg-vexo-glass border-vexo-border text-white hover:border-vexo-pink hover:text-vexo-pink'
            }`}
            aria-label={`${isInWishlist ? 'Remove' : 'Add'} ${product.name} to wishlist`}
          >
            <HiOutlineHeart size={16} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-vexo-text-muted uppercase tracking-wider mb-1">{product.category}</p>
        <Link to={`/products/${product.slug}`} className="focus-visible:ring-2 focus-visible:ring-vexo-blue focus-visible:ring-offset-2 focus-visible:ring-offset-vexo-bg outline-none rounded-lg inline-block max-w-full">
          <h3 className="font-heading font-semibold text-sm md:text-base truncate hover:text-vexo-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2" role="img" aria-label={`${product.rating} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <HiStar key={i} size={14} className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-vexo-text-muted/30'} aria-hidden="true" />
          ))}
          <span className="text-xs text-vexo-text-muted ml-1">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-bold text-vexo-blue">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-sm text-vexo-text-muted line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
