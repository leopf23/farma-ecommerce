"use client";
import { useRouter } from "next/navigation";
import Banner from "../component/banner";
import MultiCard from "../component/multiCard";
import CardProduct from "../component/cardProduct";
import HorizontalProduct from "../component/horizontalProduct";
import { useCategories } from "@/src/hooks/Categories";
import { useStoreCategories } from "@/src/hooks/Categories/StoreProvider";
import { useProducts } from "@/src/hooks/Products";
import { useStoreProducts } from "@/src/hooks/Products/StoreProvider";
import { useCart } from "@/src/hooks/Cart";
import { mapProductToCard } from "@/src/utils/productMapper";
import { shuffleArray } from "@/src/utils/methods";
import { useEffect, useMemo, useState } from "react";
import { CiStar } from "react-icons/ci";
import CardProductSkeleton from "../component/CardProductSkeleton";
import HorizontalProductSkeleton from "../component/HorizontalProductSkeleton";
import MultiCardSkeleton from "../component/MultiCardSkeleton";

export default function Home() {
  const router = useRouter();
  const { getAllCategories } = useCategories();
  const { categories } = useStoreCategories();
  const { getProducts } = useProducts();
  const { products } = useStoreProducts();
  const { addItem } = useCart();
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    setLoadingCategories(true);
    getAllCategories().finally(() => setLoadingCategories(false));
  }, []);

  useEffect(() => {
    setLoadingProducts(true);
    getProducts({ page: 1, perPage: 20 })
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shuffledProducts = useMemo(
    () => (products && products.length ? shuffleArray(products) : []),
    [products]
  );

  // const categories = [
  //   { label: "Belleza", Icon: CiStar },
  //   { label: "Medicamentos", Icon: PiPillLight },
  //   { label: "Comestibles", Icon: CiApple },
  //   { label: "Bebes", Icon: PiBabyCarriageLight },
  // ];

  return (
    <>
      {/* Banner */}
      <Banner imageUrl="/banner-web.jpg" />

      {/* Categorías */}
      <div className="justify-items-center gap-6 grid grid-cols-2 lg:grid-cols-4 p-10">
        {loadingCategories ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-xl animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-200" />
              <div className="w-24 h-4 rounded bg-gray-200" />
            </div>
          ))
        ) : categories && categories.length > 0 ? categories.map(({ familiaUno, id }: any) => (
          <div
            key={id}
            onClick={() => router.push(`/category/${id}`)}
            className="flex items-center gap-2 hover:bg-[#2c27af09] p-3 rounded-xl text-[#2B27AF] cursor-pointer"
          >
            <CiStar size={35} />
            <span className="font-medium text-sm">{familiaUno}</span>
          </div>
        )) : null}
      </div>

      {/* MultiCard */}
      {loadingProducts ? (
        <MultiCardSkeleton />
      ) : (
      <MultiCard
        products={shuffledProducts?.slice(0, 5).map((p: any) => {
          const m = mapProductToCard(p);
          return { id: m.id, title: m.title, subtitle: m.subtitle ?? m.category, image: m.image, price: m.price, porcentajeDescuento: m.porcentajeDescuento };
        })}
        onAddToCart={(p) => addItem({ id: p.id, image: p.image ?? "/producto2.png", title: p.title, price: Number(p.price) || 0 })}
      />
      )}

      {/* Categorías populares */}
      <section className="my-16 text-center">
        <h2 className="mb-6 font-bold text-[#373577] text-2xl">
          Categorías populares
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {loadingCategories ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-28 h-10 rounded-full bg-gray-200 animate-pulse" />
            ))
          ) : (categories?.length
            ? categories.slice(0, 6).map(({ familiaUno, id }: any) => (
                <span
                  key={id}
                  onClick={() => router.push(`/category/${id}`)}
                  className="bg-[#ECF4F6] hover:bg-[#373577] px-5 py-2 rounded-full text-[#373577] hover:text-white cursor-pointer"
                >
                  {familiaUno}
                </span>
              ))
            : null)}
        </div>
      </section>

      {/* Productos */}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 mb-20">
        {loadingProducts ? (
          Array.from({ length: 10 }).map((_, i) => <CardProductSkeleton key={i} />)
        ) : shuffledProducts?.length ? (
          shuffledProducts.slice(0, 10).map((p: any) => {
            const mapped = mapProductToCard(p);
            return (
              <CardProduct
                key={mapped.id}
                id={mapped.id}
                image={mapped.image}
                category={mapped.category}
                title={mapped.title}
                price={mapped.price}
                onAddToCart={() => addItem({ id: mapped.id, image: mapped.image, title: mapped.title, price: Number(mapped.price) || 0 })}
              />
            );
          })
        ) : null}
      </div>

      {/* Banner secundario */}
      <Banner height="h-46" imageUrl="/banner2.png" />

      {/* Más productos */}
      <h2 className="my-10 font-bold text-[#373577] text-2xl text-center">
        Más productos para ti
      </h2>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-20">
        {loadingProducts ? (
          Array.from({ length: 6 }).map((_, i) => <HorizontalProductSkeleton key={i} />)
        ) : shuffledProducts?.length ? (
          shuffledProducts.slice(0, 12).map((p: any) => {
            const mapped = mapProductToCard(p);
            return (
              <HorizontalProduct
                key={mapped.id}
                id={mapped.id}
                image={mapped.image}
                title={mapped.title}
                price={mapped.price}
                onAddToCart={() => addItem({ id: mapped.id, image: mapped.image, title: mapped.title, price: Number(mapped.price) || 0 })}
              />
            );
          })
        ) : null}
      </div>
    </>
  );
}
