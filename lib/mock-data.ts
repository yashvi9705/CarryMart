export interface Product {
  price: any
  id: string
  name: string
  category: string
  image: string
  originalPrice: number
  salePrice: number
  unit: string
  discount: number
  description: string
  inStock: boolean
  sku?: string
  longDescription?: string
}

/**
 * CONTENTFUL STRUCTURE REFERENCE:
 * 
 * Content Model: Product
 * Fields:
 * - id (Text, required)
 * - name (Text, required)
 * - category (Text, required) [Link to Category model or enum]
 * - image (Media, required) [Featured image]
 * - originalPrice (Number, required)
 * - salePrice (Number, required)
 * - unit (Text) e.g., "500g", "1kg", "1L"
 * - discount (Number) calculated or manual
 * - description (Text)
 * - inStock (Boolean)
 * 
 * Content Model: Category
 * Fields:
 * - id (Text, required)
 * - label (Text, required)
 * - icon (Text) emoji or icon name
 * - products (Link to Product[])
 */

export const mockProducts: Product[] = [
  // Groceries
  {
    id: 'prod_1',
    name: 'Basmati Rice Premium',
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1586080872529-72f51ddfb644?w=300&h=300&fit=crop',
    originalPrice: 450,
    salePrice: 399,
    unit: '1 kg',
    discount: 11,
    description: 'Premium basmati rice, aged and fragrant',
    longDescription: 'Experience the finest basmati rice with a delicate aroma and perfect grain separation. Aged to perfection, this premium variety is ideal for biryanis, pilafs, and special occasions. Each grain is long, slender, and cooks to a light, fluffy texture.',
    sku: 'SKU-001',
    inStock: true,
  },
  {
    id: 'prod_2',
    name: 'Refined Cooking Oil',
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1587362744813-66a206f79fa9?w=300&h=300&fit=crop',
    originalPrice: 320,
    salePrice: 279,
    unit: '1L',
    discount: 13,
    description: 'Pure refined vegetable oil for cooking',
    longDescription: 'Premium quality refined vegetable oil extracted from the finest seeds. Perfect for all types of cooking including frying, sautéing, and baking. Light texture ensures even heat distribution and healthy meal preparation.',
    sku: 'SKU-002',
    inStock: true,
  },
  {
    id: 'prod_3',
    name: 'Whole Wheat Flour',
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1585621427406-e99f05c8c911?w=300&h=300&fit=crop',
    originalPrice: 120,
    salePrice: 99,
    unit: '2 kg',
    discount: 17,
    description: 'Fresh ground whole wheat flour',
    inStock: true,
  },
  {
    id: 'prod_4',
    name: 'Salt - Iodized',
    category: 'groceries',
    image: 'https://images.unsplash.com/photo-1596040306161-bab4e3c6bf00?w=300&h=300&fit=crop',
    originalPrice: 30,
    salePrice: 25,
    unit: '1 kg',
    discount: 16,
    description: 'Pure iodized salt for healthy cooking',
    inStock: true,
  },

  // Fruits & Veggies
  {
    id: 'prod_5',
    name: 'Fresh Tomatoes',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1581093160562-40460efad1d0?w=300&h=300&fit=crop',
    originalPrice: 60,
    salePrice: 49,
    unit: '1 kg',
    discount: 18,
    description: 'Fresh, ripe tomatoes from local farms',
    inStock: true,
  },
  {
    id: 'prod_6',
    name: 'Onions',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1580622272707-f2e3b5e35519?w=300&h=300&fit=crop',
    originalPrice: 45,
    salePrice: 35,
    unit: '1 kg',
    discount: 22,
    description: 'Golden yellow onions, sweet and fresh',
    inStock: true,
  },
  {
    id: 'prod_7',
    name: 'Carrots',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1584701978064-c71da5f42e1e?w=300&h=300&fit=crop',
    originalPrice: 50,
    salePrice: 42,
    unit: '500g',
    discount: 16,
    description: 'Crunchy and sweet orange carrots',
    inStock: true,
  },
  {
    id: 'prod_8',
    name: 'Broccoli',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1566781796833-1fab0b2eac71?w=300&h=300&fit=crop',
    originalPrice: 100,
    salePrice: 79,
    unit: '500g',
    discount: 21,
    description: 'Fresh green broccoli florets',
    inStock: true,
  },
  {
    id: 'prod_9',
    name: 'Bananas',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    originalPrice: 55,
    salePrice: 45,
    unit: '1 kg',
    discount: 18,
    description: 'Ripe, sweet golden bananas',
    inStock: true,
  },
  {
    id: 'prod_10',
    name: 'Apples',
    category: 'fruits',
    image: 'https://images.unsplash.com/photo-1560806e614371-1e1f6b20f5b0?w=300&h=300&fit=crop',
    originalPrice: 120,
    salePrice: 99,
    unit: '1 kg',
    discount: 17,
    description: 'Crispy red delicious apples',
    inStock: true,
  },

  // Dairy & Eggs
  {
    id: 'prod_11',
    name: 'Milk - Full Cream',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1608848461950-0fed2357bb7b?w=300&h=300&fit=crop',
    originalPrice: 65,
    salePrice: 55,
    unit: '1L',
    discount: 15,
    description: 'Fresh full cream milk, daily delivery',
    inStock: true,
  },
  {
    id: 'prod_12',
    name: 'Yogurt Plain',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1488276413016-cf37c55a7fb8?w=300&h=300&fit=crop',
    originalPrice: 45,
    salePrice: 39,
    unit: '400g',
    discount: 13,
    description: 'Creamy plain yogurt, perfect for breakfast',
    inStock: true,
  },
  {
    id: 'prod_13',
    name: 'Paneer',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1618164436241-4473940571cd?w=300&h=300&fit=crop',
    originalPrice: 180,
    salePrice: 155,
    unit: '500g',
    discount: 14,
    description: 'Fresh homemade paneer cheese',
    inStock: true,
  },
  {
    id: 'prod_14',
    name: 'Eggs - Brown',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1582722872981-82e07422a514?w=300&h=300&fit=crop',
    originalPrice: 85,
    salePrice: 72,
    unit: '1 dozen',
    discount: 15,
    description: 'Farm fresh brown eggs, nutrient rich',
    inStock: true,
  },
  {
    id: 'prod_15',
    name: 'Cheddar Cheese',
    category: 'dairy',
    image: 'https://images.unsplash.com/photo-1452801828291-19e81b76b405?w=300&h=300&fit=crop',
    originalPrice: 250,
    salePrice: 215,
    unit: '200g',
    discount: 14,
    description: 'Premium cheddar cheese slices',
    inStock: true,
  },

  // Bakery
  {
    id: 'prod_16',
    name: 'Multigrain Bread',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop',
    originalPrice: 65,
    salePrice: 55,
    unit: '400g',
    discount: 15,
    description: 'Freshly baked multigrain bread',
    inStock: true,
  },
  {
    id: 'prod_17',
    name: 'Croissants',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=300&h=300&fit=crop',
    originalPrice: 120,
    salePrice: 99,
    unit: '4 pieces',
    discount: 17,
    description: 'Buttery French-style croissants',
    inStock: true,
  },
  {
    id: 'prod_18',
    name: 'Digestive Biscuits',
    category: 'bakery',
    image: 'https://images.unsplash.com/photo-1599599810694-c6ba43f8d3c3?w=300&h=300&fit=crop',
    originalPrice: 45,
    salePrice: 38,
    unit: '200g',
    discount: 15,
    description: 'Crunchy digestive biscuits, perfect with tea',
    inStock: true,
  },

  // Snacks
  {
    id: 'prod_19',
    name: 'Potato Chips',
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1599599810694-c6ba43f8d3c3?w=300&h=300&fit=crop',
    originalPrice: 40,
    salePrice: 35,
    unit: '150g',
    discount: 12,
    description: 'Crispy salted potato chips',
    inStock: true,
  },
  {
    id: 'prod_20',
    name: 'Mixed Nuts',
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1585518419759-d91b2c3b3d2c?w=300&h=300&fit=crop',
    originalPrice: 250,
    salePrice: 199,
    unit: '500g',
    discount: 20,
    description: 'Assorted roasted and salted nuts',
    inStock: true,
  },
  {
    id: 'prod_21',
    name: 'Popcorn',
    category: 'snacks',
    image: 'https://images.unsplash.com/photo-1585770908537-a3c93b88ecfb?w=300&h=300&fit=crop',
    originalPrice: 60,
    salePrice: 49,
    unit: '200g',
    discount: 18,
    description: 'Light and fluffy buttered popcorn',
    inStock: true,
  },

  // Beverages
  {
    id: 'prod_22',
    name: 'Orange Juice',
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd1f8c16?w=300&h=300&fit=crop',
    originalPrice: 120,
    salePrice: 99,
    unit: '1L',
    discount: 17,
    description: 'Fresh squeezed orange juice',
    inStock: true,
  },
  {
    id: 'prod_23',
    name: 'Coffee Powder',
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b3f2?w=300&h=300&fit=crop',
    originalPrice: 280,
    salePrice: 239,
    unit: '250g',
    discount: 14,
    description: 'Premium arabica coffee powder',
    inStock: true,
  },
  {
    id: 'prod_24',
    name: 'Green Tea',
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1597318973589-1f92fbd4cfb4?w=300&h=300&fit=crop',
    originalPrice: 180,
    salePrice: 149,
    unit: '25 bags',
    discount: 17,
    description: 'Organic green tea bags',
    inStock: true,
  },
  {
    id: 'prod_25',
    name: 'Soft Drink',
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1554866585-f9e83d5e32d7?w=300&h=300&fit=crop',
    originalPrice: 80,
    salePrice: 65,
    unit: '2L',
    discount: 18,
    description: 'Refreshing cold drink bottle',
    inStock: true,
  },

  // Personal Care
  {
    id: 'prod_26',
    name: 'Hand Soap',
    category: 'personal',
    image: 'https://images.unsplash.com/photo-1585514261519-a6cf2e8dbb3f?w=300&h=300&fit=crop',
    originalPrice: 80,
    salePrice: 65,
    unit: '500ml',
    discount: 18,
    description: 'Antibacterial hand soap',
    inStock: true,
  },
  {
    id: 'prod_27',
    name: 'Shampoo',
    category: 'personal',
    image: 'https://images.unsplash.com/photo-1599257720797-e626b6d1e5f1?w=300&h=300&fit=crop',
    originalPrice: 250,
    salePrice: 199,
    unit: '400ml',
    discount: 20,
    description: 'Nourishing herbal shampoo',
    inStock: true,
  },
  {
    id: 'prod_28',
    name: 'Toothpaste',
    category: 'personal',
    image: 'https://images.unsplash.com/photo-1610238455029-5e9d5fe4c1f7?w=300&h=300&fit=crop',
    originalPrice: 60,
    salePrice: 45,
    unit: '100g',
    discount: 25,
    description: 'Minty fresh cavity protection toothpaste',
    inStock: true,
  },
]
