import { create } from 'zustand';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    stock: number;
    slug: string;
  };
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
  isOpen: boolean;
  setCart: (cart: { items: CartItem[]; totalPrice: number; totalItems: number }) => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalPrice: 0,
  totalItems: 0,
  isOpen: false,

  setCart: (cart) => set({
    items: cart.items,
    totalPrice: cart.totalPrice,
    totalItems: cart.totalItems,
  }),

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  clearLocalCart: () => set({ items: [], totalPrice: 0, totalItems: 0 }),
}));
