import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { setCart, openCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  const { data, isLoading } = useQuery({
    queryKey: ['products', { search, category, sort, page }],
    queryFn: () => api.get('/products', { params: { search, category, sort, page, limit: 12 } }).then(r => r.data.data),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/products/categories').then(r => r.data.data),
  });

  const addToCartMutation = useMutation({
    mutationFn: (productId: string) => api.post('/cart', { productId, quantity: 1 }),
    onSuccess: (res) => { setCart(res.data.data); openCart(); toast.success('Added to cart!'); },
    onError: () => toast.error('Failed to add to cart'),
  });

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value); else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const products = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="page-container py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-heading">
            {search ? `Results for "${search}"` : category || 'All Products'}
          </h1>
          {data && <p className="text-vexo-text-muted mt-1">{data.total} products found</p>}
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)} className="btn-secondary flex items-center gap-2 lg:hidden">
          <HiOutlineAdjustments size={18} /> Filters
        </button>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${filtersOpen ? 'fixed inset-0 z-40 bg-vexo-bg p-6 overflow-y-auto' : 'hidden'} lg:block lg:static lg:w-64 shrink-0`}>
          <div className="flex items-center justify-between lg:hidden mb-6">
            <h3 className="font-heading font-bold text-lg">Filters</h3>
            <button onClick={() => setFiltersOpen(false)}><HiOutlineX size={24} /></button>
          </div>

          {/* Categories */}
          <div className="glass-card p-5 mb-4">
            <h4 className="font-heading font-semibold mb-3">Category</h4>
            <div className="space-y-2">
              <button onClick={() => updateFilter('category', '')}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-vexo-blue/10 text-vexo-blue' : 'text-vexo-text-secondary hover:text-white hover:bg-vexo-glass'}`}>
                All Categories
              </button>
              {(categories || []).map((cat: string) => (
                <button key={cat} onClick={() => updateFilter('category', cat)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${category === cat ? 'bg-vexo-blue/10 text-vexo-blue' : 'text-vexo-text-secondary hover:text-white hover:bg-vexo-glass'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="glass-card p-5">
            <h4 className="font-heading font-semibold mb-3">Sort By</h4>
            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)}
              className="input-field text-sm">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass-card animate-pulse">
                  <div className="aspect-square bg-vexo-bg-tertiary rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-vexo-bg-tertiary rounded w-1/3" />
                    <div className="h-4 bg-vexo-bg-tertiary rounded w-2/3" />
                    <div className="h-5 bg-vexo-bg-tertiary rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-vexo-text-muted text-lg">No products found</p>
            </div>
          ) : (
            <>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: any) => (
                  <ProductCard key={product._id} product={product}
                    onAddToCart={() => {
                      if (!isAuthenticated) { toast.error('Please sign in to add to cart'); return; }
                      addToCartMutation.mutate(product._id);
                    }}
                  />
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {[...Array(totalPages)].map((_, i) => (
                    <button key={i} onClick={() => updateFilter('page', String(i + 1))}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${page === i + 1 ? 'bg-gradient-vexo text-white shadow-glow-blue' : 'glass-card text-vexo-text-secondary hover:text-white'}`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
