"use client"

import React from 'react'

export default function MultiCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 animate-pulse">
      {/* Card destacado grande */}
      <div className="lg:col-span-2 lg:row-span-2 rounded-lg p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center lg:gap-4 bg-[#D7F3E6]">
        <div className="w-2/5 h-48 lg:h-56 rounded-lg bg-gray-300 shrink-0" />
        <div className="flex-1 space-y-3 mt-4 lg:mt-0">
          <div className="w-24 h-5 rounded bg-gray-300" />
          <div className="w-full h-4 rounded bg-gray-300" />
          <div className="w-3/4 h-6 rounded bg-gray-300" />
          <div className="w-32 h-10 rounded-full bg-gray-300 mt-4" />
        </div>
      </div>
      {/* 4 cards pequeños */}
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`rounded-lg p-4 flex flex-col ${i % 2 ? 'bg-[#DDE8FB]' : 'bg-[#E8F7FF]'}`}
        >
          <div className="w-24 h-5 rounded bg-gray-300 mb-2" />
          <div className="w-full h-3 rounded bg-gray-300 mb-2" />
          <div className="w-4/5 h-5 rounded bg-gray-300 mb-4" />
          <div className="w-32 h-9 rounded-full bg-gray-300 mt-auto" />
        </div>
      ))}
    </div>
  )
}
