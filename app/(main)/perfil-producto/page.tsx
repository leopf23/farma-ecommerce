"use client"
import ProductViewer from '@/app/component/productViewer'
import React from 'react'

export default function page() {
  const images = [
    '/profile.png',
    '/banner2.png',
    '/file.svg',
    '/globe.svg'
  ];
  return (
    <div>
        <ProductViewer images={images} title='Premium whey Proteina' unitPrice={100} />
    </div>
  )
}