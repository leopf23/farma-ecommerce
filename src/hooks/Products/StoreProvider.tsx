"use client";

import { createContext, useContext, useReducer } from "react";
import ProductsTypes, { TypesProducts } from "./ProductsTypes";

const StoreContextProducts = createContext<any | null>(null);

const initialState = {
  products: [],
  pagination: {
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
  },
};

export default function StoreProviderProducts({ children }: { children: React.ReactNode }) {
  const [store, dispatch] = useReducer(ProductsTypes, initialState);

  return (
    <StoreContextProducts.Provider value={[store, dispatch]}>
      {children}
    </StoreContextProducts.Provider>
  );
}

const useStoreProducts = () => useContext(StoreContextProducts)[0];
const useDispatchProducts = () => useContext(StoreContextProducts)[1];

export {
  StoreContextProducts,
  useDispatchProducts,
  useStoreProducts,
  TypesProducts,
};
