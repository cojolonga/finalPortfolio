'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-criforge-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-cinzel font-bold text-criforge-accent mb-6">
          Error
        </h1>
        <h2 className="text-2xl font-cinzel text-white mb-4">
          Something went wrong!
        </h2>
        <p className="text-criforge-fg-secondary mb-8">
          An unexpected error occurred while loading the page.
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-gradient-to-r from-criforge-accent-dark to-criforge-accent text-white font-bold font-cinzel uppercase tracking-wide hover:shadow-lg hover:shadow-criforge-accent/30 transition-all transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
