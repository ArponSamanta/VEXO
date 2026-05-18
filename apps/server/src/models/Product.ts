import mongoose, { Schema, Document } from 'mongoose';
import slugify from 'slugify';

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: string;
  brand: string;
  stock: number;
  sku: string;
  rating: number;
  numReviews: number;
  featured: boolean;
  tags: string[];
  specifications: Map<string, string>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    images: [{ type: String, required: true }],
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false, index: true },
    tags: [{ type: String }],
    specifications: { type: Map, of: String, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Generate slug before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

// Text index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text', brand: 'text' });

export default mongoose.model<IProductDocument>('Product', productSchema);
