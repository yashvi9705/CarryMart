'use client'

import Image from 'next/image'

interface CategoryNavProps {
  categories: any[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export default function CategoryNav({ categories, selectedCategory, onCategoryChange }: CategoryNavProps) {
  return (
    <div className="w-full">
      <div className="mb-12">
        <h3 className="text-3xl font-bold text-gray-900 text-center">Browse your categories</h3>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              group relative overflow-hidden rounded-lg h-40 lg:h-48 transition-all duration-300
              ${selectedCategory === category.id ? 'ring-2 ring-blue-600 shadow-lg' : 'hover:shadow-md'}
            `}
          >
            <Image
              src={category.image}
              alt={category.name}
              fill
              loading="eager"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            
            <div className="absolute inset-0 flex items-end p-4">
              <span className={`text-lg font-semibold transition-colors duration-300 text-white`}>
                {category.name}
              </span>
            </div>
          </button>
        ))}
          
      </div>




    </div>
  )
}
