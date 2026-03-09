const TypesProducts = {
  GET_PRODUCTS: "GET_PRODUCTS",
};

export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

function ProductsTypes(state: any, action: any) {
  const { type, payload } = action;
  switch (type) {
    case TypesProducts.GET_PRODUCTS:
      return {
        ...state,
        products: payload.products,
        pagination: payload.pagination ?? state.pagination,
      };
    default:
      return state;
  }
}

export { TypesProducts };
export default ProductsTypes;
