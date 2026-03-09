"use client"

import React from 'react'

export default function HorizontalProductSkeleton() {
  return (
    <div className="flex items-center gap-6 bg-white p-4 rounded-lg max-w-md animate-pulse">
      <div className="w-24 h-24 rounded-lg bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="w-full h-4 rounded bg-gray-200" />
        <div className="w-16 h-5 rounded bg-gray-200" />
        <div className="w-24 h-8 rounded-lg bg-gray-200" />
      </div>
    </div>
  )
}
