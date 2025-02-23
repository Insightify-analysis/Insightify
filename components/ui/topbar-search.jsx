"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function TopbarSearch({ searchCategories, activeCategory, setActiveCategory }) {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center border-b">
                {searchCategories.map((category) => (
                    <Button
                        key={category.name}
                        variant="outline"
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-none",
                            activeCategory.name === category.name && "border-b-2 border-primary",
                        )}
                        onClick={() => setActiveCategory(category)}
                    >
                        <category.icon className="h-4 w-4" />
                        <span className="hidden sm:inline">{category.name}</span>
                    </Button>
                ))}
            </div>
        </div>
    )
}
