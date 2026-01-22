"use client"
import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'
import { products } from '../../data/products'
import CardProduct from '../../component/cardProduct'
import ProductCarousel from '../../component/productCarousel'

function SearchResults() {
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q')

  const filteredProducts = searchQuery
    ? products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  // Get 4 recommended products for the carousel
  const recommendedProducts = products.slice(0, 4).map((product) => ({
    id: product.id,
    image: product.image,
    title: product.title,
    price: product.price,
    rating: 4.5 - Math.random() * 0.5, // Random rating between 4.0 and 4.5
    reviewCount: Math.floor(Math.random() * 500) + 50, // Random review count between 50-550
    listPrice: Math.random() > 0.5 ? product.price * 1.2 : undefined, // Sometimes show list price
    isPrime: Math.random() > 0.3, // 70% chance of being prime
  }))

  return (
    <div className="mx-auto px-4 py-8 container">
      <h1 className="mb-4 font-bold text-2xl">Resultados de la búsqueda para: "{searchQuery}"</h1>
      
      {/* Recommended Products Carousel */}
      <ProductCarousel 
        products={recommendedProducts}
        itemsPerSlide={2}
        title="Productos Recomendados"
      />
      
      {/* Search Results */}
      {filteredProducts.length > 0 ? (
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
