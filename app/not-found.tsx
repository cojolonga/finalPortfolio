import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-criforge-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-6xl font-cinzel font-bold text-criforge-accent mb-6">
          404
        </h1>
        <h2 className="text-2xl font-cinzel text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-criforge-fg-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-gradient-to-r from-criforge-accent-dark to-criforge-accent text-white font-bold font-cinzel uppercase tracking-wide hover:shadow-lg hover:shadow-criforge-accent/30 transition-all transform hover:scale-105"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
