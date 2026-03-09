"use client"

import React from 'react'

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-6 h-6 border-2',
  md: 'w-10 h-10 border-2',
  lg: 'w-14 h-14 border-4',
}

export default function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`${sizeClasses[size]} border-[#2B27AF] border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Cargando"
    />
  )
}
