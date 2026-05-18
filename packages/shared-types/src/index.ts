// ==================== USER ====================
export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'superadmin';
  avatar?: string;
  phone?: string;
  addresses: IAddress[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IAuthResponse {
  user: IUser;
  accessToken: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

// ==================== PRODUCT ====================
export interface IProduct {
  _id: string;
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
  specifications: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentCategory?: string;
  isActive: boolean;
}

export interface IProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'rating' | 'popular';
  page?: number;
  limit?: number;
}

export interface IPaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==================== CART ====================
export interface ICartItem {
  _id?: string;
  product: IProduct | string;
  quantity: number;
  price: number;
}

export interface ICart {
  _id: string;
  user: string;
  items: ICartItem[];
  totalPrice: number;
  totalItems: number;
}

// ==================== ORDER ====================
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface IOrderItem {
  product: IProduct | string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id: string;
  user: IUser | string;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IAddress;
  paymentMethod: 'razorpay' | 'stripe' | 'cod';
  paymentStatus: PaymentStatus;
  paymentId?: string;
  razorpayOrderId?: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  discountAmount: number;
  totalPrice: number;
  couponCode?: string;
  status: OrderStatus;
  statusHistory: IStatusUpdate[];
  notes?: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStatusUpdate {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface ICreateOrderRequest {
  items: { product: string; quantity: number }[];
  shippingAddress: IAddress;
  paymentMethod: 'razorpay' | 'stripe' | 'cod';
  couponCode?: string;
}

// ==================== REVIEW ====================
export interface IReview {
  _id: string;
  user: IUser | string;
  product: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== WISHLIST ====================
export interface IWishlist {
  _id: string;
  user: string;
  products: IProduct[];
}

// ==================== COUPON ====================
export interface ICoupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

// ==================== ANALYTICS ====================
export interface IDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
}

export interface IRevenueData {
  date: string;
  revenue: number;
  orders: number;
}

// ==================== AUDIT LOG ====================
export interface IAuditLog {
  _id: string;
  user: IUser | string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, unknown>;
  ipAddress: string;
  createdAt: string;
}

// ==================== API RESPONSE ====================
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
