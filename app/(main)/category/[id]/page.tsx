"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CardProduct from "../../../component/cardProduct";
import CardProductSkeleton from "../../../component/CardProductSkeleton";
import Pagination from "../../../component/Pagination";
import { useProducts } from "@/src/hooks/Products";
import { useStoreProducts } from "@/src/hooks/Products/StoreProvider";
import { useCart } from "@/src/hooks/Cart";
import { useStoreCategories } from "@/src/hooks/Categories/StoreProvider";
import { mapProductToCard, type MappedProduct } from "@/src/utils/productMapper";

function CategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.id as string;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const perPage = Math.min(50, Math.max(10, parseInt(searchParams.get("perPage") || "20", 10)));
  const { getProducts } = useProducts();
  const { products, pagination } = useStoreProducts();
  const { addItem } = useCart();
  const { categories } = useStoreCategories();
  const [loading, setLoading] = useState(true);

  const categoryName =
    categories?.find((c: any) => String(c.id) === String(categoryId))?.familiaUno ?? "Categoría";

  useEffect(() => {
    setLoading(true);
    getProducts({ categoria: categoryId, page, perPage }).finally(() =>
      setLoading(false)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, page, perPage]);

  const mappedProducts: MappedProduct[] = (products || []).map(mapProductToCard);

  return (
    <div className="mx-auto px-4 py-8 container">
      <h1 className="mb-6 font-bold text-2xl">{categoryName}</h1>

      {loading ? (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardProductSkeleton key={i} />
          ))}
        </div>
      ) : mappedProducts.length > 0 ? (
        <>
          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {mappedProducts.map((product) => (
              <CardProduct
                key={product.id}
                id={product.id}
                image={product.image}
                category={product.category}
                title={product.title}
                price={product.price}
                onAddToCart={() => addItem({ id: product.id, image: product.image, title: product.title, price: Number(product.price) || 0 })}
              />
            ))}
          </div>
          <Pagination
            page={pagination?.page ?? 1}
            totalPages={pagination?.totalPages ?? 1}
            total={pagination?.total ?? 0}
            perPage={pagination?.perPage ?? perPage}
            useUrl
          />
        </>
      ) : (
        <p>No hay productos en esta categoría.</p>
      )}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto px-4 py-8 container">
        <div className="mb-6 w-48 h-8 rounded bg-gray-200 animate-pulse" />
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardProductSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <CategoryContent />
    </Suspense>
  );
}
