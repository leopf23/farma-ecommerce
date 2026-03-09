"use client";

import { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import cartReducer, { TypesCart, type CartItem } from "./cartTypes";

const CART_STORAGE_KEY = "farma_cart";

const StoreContextCart = createContext<any | null>(null);

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export default function StoreProviderCart({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const items = loadFromStorage();
    if (items.length) dispatch({ type: TypesCart.SET_ITEMS, payload: { items } });
  }, []);

  useEffect(() => {
    saveToStorage(store.items);
  }, [store.items]);

  return (
    <StoreContextCart.Provider value={[store, dispatch]}>
      {children}
    </StoreContextCart.Provider>
  );
}

const useStoreCart = () => useContext(StoreContextCart)[0];
const useDispatchCart = () => useContext(StoreContextCart)[1];

export { StoreContextCart, useStoreCart, useDispatchCart, TypesCart };
