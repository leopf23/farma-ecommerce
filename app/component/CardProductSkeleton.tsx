"use client"

import React from 'react'

export default function CardProductSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 mx-auto mb-10 max-w-xs animate-pulse">
      <div className="w-full h-64 rounded-2xl bg-gray-200" />
      <div className="w-20 h-4 rounded bg-gray-200" />
      <div className="w-full h-6 rounded bg-gray-200" />
      <div className="w-16 h-5 rounded bg-gray-200" />
      <div className="w-full h-12 rounded-full bg-gray-200" />
    </div>
  )
}
