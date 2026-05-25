import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, ShippingAddress } from "./types";

interface CartState {
  items: CartItem[];
  shippingAddress: ShippingAddress | null;
  shippingMethod: "standard" | "express" | "overnight";
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateItem: (
    productId: string,
    variantId: string,
    updates: Partial<CartItem>
  ) => void;
  clearCart: () => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setShippingMethod: (method: "standard" | "express" | "overnight") => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingAddress: null,
      shippingMethod: "standard",

      addItem: (item) =>
        set((state) => {
          // Check if item already exists
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.variantId === item.variantId &&
              i.optionId === item.optionId
          );

          if (existingIndex >= 0) {
            // Update existing item
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              ...item,
            };
            return { items: newItems };
          }

          // Add new item
          return { items: [...state.items, item] };
        }),

      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variantId === variantId)
          ),
        })),

      updateItem: (productId, variantId, updates) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variantId === variantId
              ? { ...item, ...updates }
              : item
          ),
        })),

      clearCart: () =>
        set({
          items: [],
          shippingAddress: null,
          shippingMethod: "standard",
        }),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      setShippingMethod: (method) => set({ shippingMethod: method }),

      getItemCount: () => {
        const state = get();
        return state.items.length;
      },
    }),
    {
      name: "printflow-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Toast notifications store
interface ToastState {
  toasts: Array<{
    id: string;
    title: string;
    description?: string;
    type: "success" | "error" | "info" | "warning";
  }>;
  addToast: (
    toast: Omit<ToastState["toasts"][0], "id">
  ) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],

  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          ...toast,
          id: Date.now().toString(),
        },
      ],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// UI state store
interface UIState {
  mobileMenuOpen: boolean;
  cartDrawerOpen: boolean;
  toggleMobileMenu: () => void;
  toggleCartDrawer: () => void;
  setCartDrawerOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  mobileMenuOpen: false,
  cartDrawerOpen: false,

  toggleMobileMenu: () =>
    set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen })),

  toggleCartDrawer: () =>
    set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),

  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
}));
