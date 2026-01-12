import React from 'react'
import ProductViewer from '../component/productViewer'


export default function page() {
  const images = [
    '/profile.png',
    '/profile.png',
    '/profile.png'
  ]

  return (
    <div className="mx-auto px-4 py-10 max-w-7xl">
      <ProductViewer images={images} title="Premium whey Proteina" unitPrice={3000} />
    </div>
  )
}
