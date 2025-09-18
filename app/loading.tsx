export default function Loading() {
  return (
    <div className="min-h-screen bg-criforge-bg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-criforge-accent mx-auto mb-4"></div>
        <h2 className="text-xl font-cinzel text-white">Loading...</h2>
      </div>
    </div>
  )
}
