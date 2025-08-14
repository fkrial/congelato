import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { StorySection } from "@/components/story-section"
import { WholesaleTeaser } from "@/components/wholesale-teaser"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
        <StorySection />
        <WholesaleTeaser />
      </main>
      <Footer />
    </div>
  )
}
