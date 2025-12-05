'use client'
import { useEffect } from 'react'

export default function ThemeInit() {
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])
  return null
}
