import { Suspense } from "react"
import { SearchBar } from "@/components/search-bar"
import { CategoryGrid } from "@/components/category-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { HeroBanner } from "@/components/hero-banner"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:hidden">
        <SearchBar />
      </div>

      {/* Main Content */}
      <main className="pb-20 lg:pb-8">
        {/* Hero Banner with Video */}
        <HeroBanner />

        {/* Categories */}
        <section className="px-4 py-6 lg:px-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground mb-4 lg:mb-6">Shop by Style</h2>
          <CategoryGrid />
        </section>

        {/* Featured Products */}
        <section className="px-4 py-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">Featured Shirts</h2>
            <button className="text-sm text-secondary font-medium hover:text-secondary/80 transition-colors">
              See All
            </button>
          </div>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse rounded-lg h-64"></div>
                ))}
              </div>
            }
          >
            <FeaturedProducts />
          </Suspense>
        </section>

        {/* Newsletter Section */}
        <section className="px-4 py-8 lg:px-8">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 lg:p-8 text-center">
            <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-2">Stay Updated</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the latest updates on new shirt collections and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
              />
              <button className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNavigation />
    </div>
  )
}
