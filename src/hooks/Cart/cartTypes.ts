export interface CartItem {
  id: string | number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

const TypesCart = {
  SET_ITEMS: "SET_ITEMS",
  ADD_ITEM: "ADD_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  REMOVE_ITEM: "REMOVE_ITEM",
};

function cartReducer(state: { items: CartItem[] }, action: any) {
  const { type, payload } = action;
  switch (type) {
    case TypesCart.SET_ITEMS:
      return { items: payload.items ?? [] };
    case TypesCart.ADD_ITEM: {
      const item = payload.item;
      const existing = state.items.find((i) => String(i.id) === String(item.id));
      let items;
      if (existing) {
        items = state.items.map((i) =>
          String(i.id) === String(item.id)
            ? { ...i, quantity: i.quantity + (item.quantity ?? 1) }
            : i
        );
      } else {
        items = [...state.items, { ...item, quantity: item.quantity ?? 1 }];
      }
      return { items };
    }
    case TypesCart.UPDATE_QUANTITY: {
      const { id, quantity } = payload;
      if (quantity < 1) return state;
      const items = state.items.map((i) =>
        String(i.id) === String(id) ? { ...i, quantity } : i
      );
      return { items };
    }
    case TypesCart.REMOVE_ITEM: {
      const items = state.items.filter((i) => String(i.id) !== String(payload.id));
      return { items };
    }
    default:
      return state;
  }
}

export { TypesCart };
export default cartReducer;
