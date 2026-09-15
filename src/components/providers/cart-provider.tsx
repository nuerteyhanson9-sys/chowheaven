"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  type AppliedCoupon,
  type CartItem,
  type CartState,
  cartItemKey,
  cartSubtotal,
  computeTotals,
  mergeCartItems,
  CART_STORAGE_KEY,
} from "@/lib/cart";
import {
  loadPersistedCart,
  persistCart,
} from "@/app/actions/cart";

export type CartMeta = {
  deliveryFee: number;
  deliveryMinOrder: number;
};

type CartContextValue = {
  items: CartItem[];
  coupon: AppliedCoupon | null;
  count: number;
  subtotal: number;
  hydrated: boolean;
  isAuthed: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  updateQty: (key: string, qty: number) => void;
  updateNote: (key: string, note: string) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  setCoupon: (coupon: AppliedCoupon | null) => void;
  totals: ReturnType<typeof computeTotals>;
  meta: CartMeta;
};

const CartContext = createContext<CartContextValue | null>(null);

type CartProviderProps = {
  userId?: string | null;
  meta: CartMeta;
  children: React.ReactNode;
};

export function CartProvider({ userId, meta, children }: CartProviderProps) {
  const [state, setState] = useState<CartState>({ items: [] });
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);
  const userIdRef = useRef(userId);
  const isAuthed = Boolean(userId);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  // Boot: read localStorage, then merge any cart persisted for the logged-in user.
  useEffect(() => {
    let cancelled = false;

    async function boot() {
      const localRaw = window.localStorage.getItem(CART_STORAGE_KEY);
      const localItems = localRaw ? (JSON.parse(localRaw) as CartItem[]) : [];

      if (userIdRef.current) {
        try {
          const serverItems = await loadPersistedCart();
          const merged = mergeCartItems([...serverItems, ...localItems]);
          setState((prev) => ({ ...prev, items: merged }));
          window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(merged));
          if (!cancelled) setHydrated(true);
          return;
        } catch {
          // fall through to local-only cart
        }
      }
      setState({ items: mergeCartItems(localItems) });
      setHydrated(true);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist: localStorage always; DB sync (debounced) for authenticated users.
  const persist = useCallback((next: CartState, force = false) => {
    if (!hydratedRef.current && !force) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next.items));
    }
    if (userIdRef.current) {
      persistCart(next.items).catch(() => {
        // silent — DB sync is best-effort; localStorage is the source for guests
      });
    }
  }, []);

  useEffect(() => {
    hydratedRef.current = hydrated;
    if (hydrated) {
      persist(state, true);
    }
  }, [state, hydrated, persist]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setState((prev) => {
      const existing = mergeCartItems([...prev.items, { ...item, qty }]);
      return { ...prev, items: existing };
    });
  }, []);

  const updateQty = useCallback((key: string, qty: number) => {
    setState((prev) => {
      if (qty <= 0) {
        return { ...prev, items: prev.items.filter((i) => cartItemKey(i) !== key) };
      }
      return {
        ...prev,
        items: prev.items.map((i) => (cartItemKey(i) === key ? { ...i, qty } : i)),
      };
    });
  }, []);

  const updateNote = useCallback((key: string, note: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.map((i) => (cartItemKey(i) === key ? { ...i, note } : i)),
    }));
  }, []);

  const removeItem = useCallback((key: string) => {
    setState((prev) => ({ ...prev, items: prev.items.filter((i) => cartItemKey(i) !== key) }));
  }, []);

  const clearCart = useCallback(() => {
    setState({ items: [], coupon: null });
    persistCart([]).catch(() => {});
  }, []);

  const setCoupon = useCallback((coupon: AppliedCoupon | null) => {
    setState((prev) => ({ ...prev, coupon }));
  }, []);

  const subtotal = useMemo(() => cartSubtotal(state.items), [state.items]);
  const count = useMemo(() => state.items.reduce((sum, i) => sum + i.qty, 0), [state.items]);
  const totals = useMemo(
    () => computeTotals(state.items, meta.deliveryFee, state.coupon),
    [state.items, meta.deliveryFee, state.coupon],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      coupon: state.coupon ?? null,
      count,
      subtotal,
      hydrated,
      isAuthed,
      addItem,
      updateQty,
      updateNote,
      removeItem,
      clearCart,
      setCoupon,
      totals,
      meta,
    }),
    [
      state.items,
      state.coupon,
      count,
      subtotal,
      hydrated,
      isAuthed,
      addItem,
      updateQty,
      updateNote,
      removeItem,
      clearCart,
      setCoupon,
      totals,
      meta,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}