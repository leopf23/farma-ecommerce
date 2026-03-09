"use client"
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import CardProduct from '../../component/cardProduct'
import CardProductSkeleton from '../../component/CardProductSkeleton'
import ProductCarousel from '../../component/productCarousel'
import Pagination from '../../component/Pagination'
import { useProducts } from '@/src/hooks/Products'
import { useStoreProducts } from '@/src/hooks/Products/StoreProvider'
import { useCart } from '@/src/hooks/Cart'
import { mapProductToCard } from '@/src/utils/productMapper'

function SearchResults() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const perPage = Math.min(50, Math.max(10, parseInt(searchParams.get('perPage') || '20', 10)))
  const { getProducts } = useProducts()
  const { products, pagination } = useStoreProducts()
  const { addItem } = useCart()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getProducts({
      ...(searchQuery ? { nombre: searchQuery } : {}),
      page,
      perPage,
    }).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page, perPage])

  const mappedProducts = (products || []).map(mapProductToCard)
  const recommendedProducts = mappedProducts.slice(0, 4).map((p) => ({
    id: p.id,
    image: p.image,
    title: p.title,
    price: p.price,
    rating: 4.5 - Math.random() * 0.5,
    reviewCount: Math.floor(Math.random() * 500) + 50,
    listPrice: Math.random() > 0.5 ? Number(p.price) * 1.2 : undefined,
    isPrime: Math.random() > 0.3,
  }))

  return (
    <div className="mx-auto px-4 py-8 container">
      <h1 className="mb-4 font-bold text-2xl">
        {searchQuery ? `Resultados para: "${searchQuery}"` : 'Todos los productos'}
      </h1>
      
      {searchQuery && mappedProducts.length > 0 && (
        <ProductCarousel
          products={recommendedProducts}
          itemsPerSlide={2}
          title="Productos Recomendados"
        />
      )}
      
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
        <p>No se encontraron productos{searchQuery ? ` para: "${searchQuery}"` : ''}.</p>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto px-4 py-8 container">
        <div className="mb-4 w-64 h-8 rounded bg-gray-200 animate-pulse" />
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardProductSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <SearchResults />
    </Suspense>
  )
}
