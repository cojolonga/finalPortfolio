import { PortfolioGallery } from "@/components/ui/portfolio-gallery";

export default function PortfolioGalleryDemo() {
  // Imágenes adaptadas a tu portfolio de restauración y edición
  const portfolioImages = [
    {
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=600&fit=crop&q=80",
      alt: "Photo Restoration - Vintage Family Portrait",
    },
    {
      src: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop&q=80",
      alt: "Creative Edit - Artistic Portrait",
    },
    {
      src: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=600&fit=crop&q=80",
      alt: "Video Production - Cinematic Scene",
    },
    {
      src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=600&fit=crop&q=80",
      alt: "Photo Enhancement - Professional Headshot",
    },
    {
      src: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=600&fit=crop&q=80",
      alt: "Color Grading - Cinematic Look",
    },
    {
      src: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop&q=80",
      alt: "Digital Art - Creative Manipulation",
    },
    {
      src: "https://images.unsplash.com/photo-1611605698335-8b1569810432?w=800&h=600&fit=crop&q=80",
      alt: "Retouching - Beauty Enhancement",
    },
    {
      src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop&q=80",
      alt: "Vintage Restoration - Old Photograph",
    },
  ];

  const handleImageClick = (index: number) => {
    console.log(`Clicked image ${index}`);
    // Aquí puedes añadir lógica para abrir un lightbox o navegar a la página del proyecto
  };

  return (
    <PortfolioGallery
      title="Explore My Creative Work"
      archiveButton={{
        text: "View Full Portfolio",
        href: "/restores"
      }}
      images={portfolioImages}
      onImageClick={handleImageClick}
      className="bg-criforge-bg"
      maxHeight={140}
      spacing="-space-x-60 md:-space-x-72"
    />
  );
}
