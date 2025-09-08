import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Heart } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

const featuredProducts = [
  {
    id: 1,
    name: "Premium Cotton Dress Shirt",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviews: 234,
    image: "/premium-white-cotton-dress-shirt.jpg",
    category: "Formal Shirts",
  },
  {
    id: 2,
    name: "Classic Polo Shirt",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.6,
    reviews: 156,
    image: "/navy-blue-polo-shirt.jpg",
    category: "Polo Shirts",
  },
  {
    id: 3,
    name: "Casual Linen Shirt",
    price: 65.99,
    originalPrice: 79.99,
    rating: 4.9,
    reviews: 89,
    image: "/light-blue-linen-casual-shirt.jpg",
    category: "Casual Shirts",
  },
  {
    id: 4,
    name: "Luxury Silk Shirt",
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviews: 312,
    image: "/black-luxury-silk-shirt.jpg",
    category: "Premium Collection",
  },
]

export function FeaturedProducts() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-card border-border/50">
          <div className="relative">
            <Link href={`/products/${product.id}`}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-40 sm:h-48 object-cover"
              />
            </Link>
            <AuthGuard>
              <button className="absolute top-2 right-2 p-1.5 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background/90 transition-colors">
                <Heart className="w-4 h-4 text-muted-foreground" />
              </button>
            </AuthGuard>
            {product.originalPrice > product.price && (
              <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded">
                Sale
              </div>
            )}
          </div>
          <CardContent className="p-3 space-y-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <h3 className="font-medium text-sm text-foreground line-clamp-2 text-balance">{product.name}</h3>
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-primary text-primary" />
              <span className="text-xs text-muted-foreground">
                {product.rating} ({product.reviews})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">${product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>

            <AuthGuard>
              <Button size="sm" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                Add to Cart
              </Button>
            </AuthGuard>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
