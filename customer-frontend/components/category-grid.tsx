import { Card } from "@/components/ui/card"
import { Shirt, Bold as Polo, Users, Sparkles } from "lucide-react"

const categories = [
  { id: "casual", name: "Casual Shirts", icon: Shirt, filter: "casual" },
  { id: "formal", name: "Formal Shirts", icon: Polo, filter: "formal" },
  { id: "polo", name: "Polo Shirts", icon: Users, filter: "polo" },
  { id: "premium", name: "Premium Collection", icon: Sparkles, filter: "premium" },
]

interface CategoryGridProps {
  onCategorySelect: (category: string) => void
  selectedCategory: string | null
}

export function CategoryGrid({ onCategorySelect, selectedCategory }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {categories.map((category) => {
        const IconComponent = category.icon
        const isSelected = selectedCategory === category.filter
        return (
          <Card 
            key={category.id} 
            className={`p-4 sm:p-6 text-center hover:shadow-md transition-all duration-200 cursor-pointer ${
              isSelected 
                ? 'bg-secondary text-secondary-foreground border-secondary shadow-md scale-105' 
                : 'bg-card/50 border-border/50 hover:bg-card hover:scale-105'
            }`}
            onClick={() => onCategorySelect(category.filter)}
          >
            <div className="flex flex-col items-center gap-2 sm:gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center ${
                isSelected ? 'text-secondary-foreground' : 'text-secondary'
              }`}>
                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <span className={`text-sm sm:text-base font-medium text-balance leading-tight ${
                isSelected ? 'text-secondary-foreground' : 'text-foreground'
              }`}>
                {category.name}
              </span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
