import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Shirt, Bold as Polo, Users, Sparkles } from "lucide-react"

const categories = [
  { id: "casual", name: "Casual Shirts", icon: Shirt, href: "/shirts/casual" },
  { id: "formal", name: "Formal Shirts", icon: Polo, href: "/shirts/formal" },
  { id: "polo", name: "Polo Shirts", icon: Users, href: "/shirts/polo" },
  { id: "premium", name: "Premium Collection", icon: Sparkles, href: "/shirts/premium" },
]

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {categories.map((category) => {
        const IconComponent = category.icon
        return (
          <Link key={category.id} href={category.href}>
            <Card className="p-4 sm:p-6 text-center hover:shadow-md transition-all duration-200 bg-card/50 border-border/50 hover:bg-card hover:scale-105">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-secondary">
                  <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <span className="text-sm sm:text-base font-medium text-foreground text-balance leading-tight">
                  {category.name}
                </span>
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
