"use client";

import { useCallback } from "react";
import { useStoreCart, useDispatchCart, TypesCart } from "./StoreProvider";
import type { CartItem } from "./cartTypes";

export interface AddToCartProduct {
  id: string | number;
  image: string;
  title: string;
  price: number;
}

export function useCart() {
  const { items } = useStoreCart();
  const dispatch = useDispatchCart();

  const addItem = useCallback(
    (product: AddToCartProduct, quantity = 1) => {
      const price =
        typeof product.price === "string"
          ? parseFloat(String(product.price).replace(/[^0-9.]/g, "")) || 0
          : Number(product.price) || 0;
      dispatch({
        type: TypesCart.ADD_ITEM,
        payload: {
          item: {
            id: product.id,
            image: product.image,
            title: product.title,
            price,
            quantity,
          },
        },
      });
    },
    [dispatch]
  );

  const updateQuantity = useCallback(
    (id: string | number, quantity: number) => {
      dispatch({ type: TypesCart.UPDATE_QUANTITY, payload: { id, quantity } });
    },
    [dispatch]
  );

  const removeItem = useCallback(
    (id: string | number) => {
      dispatch({ type: TypesCart.REMOVE_ITEM, payload: { id } });
    },
    [dispatch]
  );

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const isInCart = useCallback(
    (id: string | number) => items.some((i) => String(i.id) === String(id)),
    [items]
  );

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    totalCount,
    subtotal,
    isInCart,
  };
}
