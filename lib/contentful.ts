// Contentful Client Configuration
// This file is ready to use once you set up your Contentful space and API keys

import { createClient, EntryCollection } from 'contentful';

// Initialize Contentful client
export const contentfulClient = createClient({
  space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
});

// Type definitions for Contentful entries
export interface ContentfulProduct {
  sys: {
    id: string;
  };
  fields: {
    quantity: any;
    name: string;
    originalPrice: number;
    image: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    inStock: boolean;
    category: {
      sys: {
        id: string;
      };
    };
    unit: string;
  };
}

// ----------------------CATEGORY ---------------

export interface ContentfulCategory {
  sys: {
    id: string;
  };
  fields: {
    label: string;
    image?: {
      fields: {
        file: {
          url: string;
        };
      };
    };
    // slug: string;
    // icon?: string;
    // description?: string;
  };
}

/**
 * Fetch products by category
 */
export async function getProductsByCategory(
  categoryName: string
): Promise<ContentfulProduct[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'products',
      'fields.category': categoryName,
      limit: 1000,
      include: 2,
    });
    return entries.items as unknown as ContentfulProduct[];
  } catch (error) {
    console.error(`Error fetching products for category ${categoryName}:`, error);
    return [];
  }
}



/**
 * Convert Contentful category to app category format
 */
export function formatContentfulCategory(item: ContentfulCategory) {
  return {
    id: item.sys.id,
    name: item.fields.label,
    image: item.fields.image
    ? `https:${item.fields.image.fields.file.url}`
    : null,
    // slug: item.fields.slug,
    // icon: item.fields.icon,
    // description: item.fields.description,
  };
}



// -------------------------------------- xxxx-------------------------------



/**
 * Fetch all products from Contentful
 * Content type: 'product'
 */
export async function getProducts(): Promise<ContentfulProduct[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'products',
      limit: 1000,
      include: 2,
    });
    return entries.items as unknown as ContentfulProduct[];
  } catch (error) {
    console.error('Error fetching products from Contentful:', error);
    return [];
  }
}



/**
 * Fetch a single product by ID
 */
export async function getProductById(id: string): Promise<ContentfulProduct | null> {
  try {
    const entry = await contentfulClient.getEntry(id);
    return entry as unknown as ContentfulProduct;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
}

/**
 * Fetch all categories
 * Content type: 'category'
 */
export async function getCategories(): Promise<ContentfulCategory[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'category',
      limit: 1000,
    });
    return entries.items as unknown as ContentfulCategory[];
  } catch (error) {
    console.error('Error fetching categories from Contentful:', error);
    return [];
  }
}

/**
 * Fetch a single category by slug
 */
// export async function getCategoryBySlug(slug: string): Promise<ContentfulCategory | null> {
//   try {
//     const entries = await contentfulClient.getEntries({
//       content_type: 'category',
//       'fields.slug': slug,
//     });
//     if (entries.items.length > 0) {
//       return entries.items[0] as unknown as ContentfulCategory;
//     }
//     return null;
//   } catch (error) {
//     console.error(`Error fetching category with slug ${slug}:`, error);
//     return null;
//   }
// }

/**
 * Search products by name or description
 */
export async function searchProducts(query: string): Promise<ContentfulProduct[]> {
  try {
    const entries = await contentfulClient.getEntries({
      content_type: 'products',
      query: query,
      limit: 1000,
    });
    return entries.items as unknown as ContentfulProduct[];
  } catch (error) {
    console.error(`Error searching for products with query "${query}":`, error);
    return [];
  }
}

/**
 * Fetch products with pagination
 */
export async function getProductsPaginated(
  page: number = 1,
  limit: number = 20
): Promise<{
  products: ContentfulProduct[];
  total: number;
  pages: number;
}> {
  try {
    const skip = (page - 1) * limit;
    const entries = await contentfulClient.getEntries({
      content_type: 'products',
      skip: skip,
      limit: limit,
    });
    
    return {
      products: entries.items as unknown as ContentfulProduct[],
      total: entries.total,
      pages: Math.ceil(entries.total / limit),
    };
  } catch (error) {
    console.error('Error fetching products with pagination:', error);
    return { products: [], total: 0, pages: 0 };
  }
}

// ---------------------- PRODUCT-------------------------------
/**
 * Convert Contentful product to app product format
 */
export function formatContentfulProduct(item: ContentfulProduct) {

  return {

    id: item.sys.id,
    name: item.fields.name,
    price: item.fields.originalPrice,
    inStock: item.fields.inStock,
    image: item.fields.image
    ? `https:${item.fields.image.fields.file.url}`
    : null,
    category:  item.fields.category?.sys?.id,
    unit: item.fields.unit,
    quantity: item.fields.quantity

  }

}


