import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ProductFormPage() {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    brand: '',
    stock: '',
    featured: false,
    images: [] as string[]
  });

  const { data: product, isLoading: loadingProduct } = useQuery({
    queryKey: ['admin-product', id],
    queryFn: () => api.get(`/products/${id}`).then(r => r.data.data),
    enabled: isEditing
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || '',
        category: product.category,
        brand: product.brand,
        stock: product.stock.toString(),
        featured: product.featured,
        images: product.images
      });
    }
  }, [product]);

  const saveMut = useMutation({
    mutationFn: (data: any) => isEditing ? api.put(`/products/${id}`, data) : api.post('/products', data),
    onSuccess: () => {
      toast.success(`Product ${isEditing ? 'updated' : 'created'}`);
      navigate('/products');
    },
    onError: (e: any) => toast.error(e.response?.data?.error || 'Failed to save product')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      comparePrice: formData.comparePrice ? Number(formData.comparePrice) : undefined,
      stock: Number(formData.stock),
      // In a real app, we'd upload files to Cloudinary and get URLs back here.
      // For this phase, we'll just allow comma-separated image URLs.
      images: Array.isArray(formData.images) ? formData.images : (formData.images as string).split(',').map((s: string) => s.trim())
    };
    saveMut.mutate(payload);
  };

  if (isEditing && loadingProduct) return <div className="animate-pulse h-96 bg-vexo-bg-secondary rounded-xl" />;

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex justify-between items-center gap-4">
        <h1 className="font-heading text-xl sm:text-2xl font-bold truncate">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
        <button onClick={() => navigate('/products')} className="btn-secondary text-sm px-3 py-1.5 sm:px-4 sm:py-2 shrink-0">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Product Name *</label>
            <input type="text" className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Description *</label>
            <textarea className="input-field h-32 resize-none" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Price (₹) *</label>
            <input type="number" className="input-field" required min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Compare at Price (₹)</label>
            <input type="number" className="input-field" min="0" value={formData.comparePrice} onChange={e => setFormData({...formData, comparePrice: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Category *</label>
            <input type="text" className="input-field" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Brand *</label>
            <input type="text" className="input-field" required value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Stock *</label>
            <input type="number" className="input-field" required min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-vexo-text-secondary">Image URLs (comma separated) *</label>
            <textarea className="input-field h-24" required value={Array.isArray(formData.images) ? formData.images.join(', ') : formData.images} onChange={e => setFormData({...formData, images: e.target.value as any})} placeholder="https://image1.jpg, https://image2.jpg" />
          </div>

          <div className="space-y-2 md:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" className="w-4 h-4 accent-vexo-blue rounded" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} />
            <label htmlFor="featured" className="text-sm font-medium text-white cursor-pointer">Featured Product</label>
          </div>
        </div>

        <div className="pt-4 sm:pt-6 border-t border-vexo-border flex justify-end gap-3 sm:gap-4">
          <button type="submit" disabled={saveMut.isPending} className="btn-primary w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-2">
            {saveMut.isPending ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
