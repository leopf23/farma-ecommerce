"use client";

import { useDispatchProducts } from "./StoreProvider";
import { TypesProducts } from "./ProductsTypes";
import { getAll } from "@/src/utils/methods";

export interface ProductsFilter {
  id?: string | number;
  nombre?: string;
  descripcion?: string;
  categoria?: string | number;
  marca?: string;
  nombreCategoria?: string;
  page?: number;
  perPage?: number;
}

const DEFAULT_PER_PAGE = 20;

export function useProducts() {
  const dispatch = useDispatchProducts();

  return {
    async getProducts(filters: ProductsFilter = {}) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
      const params = new URLSearchParams();

      const { page = 1, perPage = DEFAULT_PER_PAGE, ...rest } = filters;

      Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });
      params.append("page", String(page));
      params.append("perPage", String(perPage));

      const query = params.toString();
      const url = `${baseUrl}/list-products-public?${query}`;

      const res: any = await getAll(url);

      const productsList = res?.data ?? (Array.isArray(res) ? res : []);
      const list = Array.isArray(productsList) ? productsList : [];

      const pagination = res?.pagination ?? {
        page,
        perPage,
        total: list.length,
        totalPages: 1,
      };

      dispatch({
        type: TypesProducts.GET_PRODUCTS,
        payload: { products: list, pagination },
      });

      return { data: list, pagination };
    },
  };
}
