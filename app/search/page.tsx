"use client"
import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { products } from '../data/products'
import CardProduct from '../component/cardProduct'

function SearchResults() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Resultados de la búsqueda para: "{searchQuery}"</h1>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <CardProduct
              key={product.id}
              image={product.image}
              category={product.category}
              title={product.title}
              price={product.price}
            />
          ))}
        </div>
      ) : (
        <p>No se encontraron productos para: "{searchQuery}"</p>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SearchResults />
    </Suspense>
  )
}
