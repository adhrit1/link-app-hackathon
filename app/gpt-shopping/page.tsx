"use client"

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  title: string;
  available: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  product_url: string;
  brand_name: string;
  created_at: string;
  product_json_data: {
    id: string;
    price: string;
    title: string;
    variants: ProductVariant[];
    available: boolean;
    description: string;
    compare_at_price: string | null;
  };
  uuid: string;
  latest_rank: number | null;
  last_ranked_at: string | null;
  ranking: {
    rank: number;
    context: string;
    ranking_data: {
      rank: number;
      context: string;
      mentioned: boolean;
    };
    last_analyzed: string;
  } | null;
  is_ranked: boolean;
}

interface ProductsResponse {
  products: Product[];
  metadata: {
    total_products: number;
    ranked_products: number;
    unranked_products: number;
  };
}

// Placeholder data for blurred rows
const PLACEHOLDER_PRODUCTS = [
  {
    id: 'placeholder-1',
    name: 'Premium Hemp T-Shirt',
    brand_name: 'EcoWear',
    image_url: '/placeholder-product.jpg',
    ranking: {
      rank: 6,
      context: 'Sustainable Fashion',
      ranking_data: { mentioned: true },
      last_analyzed: new Date().toISOString()
    }
  },
  {
    id: 'placeholder-2',
    name: 'Organic Cotton Pants',
    brand_name: 'GreenStyle',
    image_url: '/placeholder-product.jpg',
    ranking: {
      rank: 7,
      context: 'Eco-friendly Clothing',
      ranking_data: { mentioned: false },
      last_analyzed: new Date().toISOString()
    }
  },
  {
    id: 'placeholder-3',
    name: 'Bamboo Fiber Jacket',
    brand_name: 'NatureFit',
    image_url: '/placeholder-product.jpg',
    ranking: {
      rank: 8,
      context: 'Sustainable Outerwear',
      ranking_data: { mentioned: true },
      last_analyzed: new Date().toISOString()
    }
  }
];

export default function GptShoppingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://llm-visibility-backend.vercel.app/api/get_data_for_frontend/get-products-by-uuid/7d90ea1d-bf9a-48fa-bebd-a8d634964db0');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: ProductsResponse = await response.json();
        // Filter products to only include those with ranking data
        const rankedProducts = data.products.filter(product => product.ranking !== null);
        // Sort products by rank (lowest/best rank first)
        rankedProducts.sort((a, b) => (a.ranking?.rank || 0) - (b.ranking?.rank || 0));
        setProducts(rankedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderTableRow = (product: any, isBlurred = false) => (
    <TableRow key={product.id} className={isBlurred ? 'blur-[2px] hover:blur-[2px]' : ''}>
      <TableCell className="font-medium">#{product.ranking?.rank}</TableCell>
      <TableCell>
        <div className="relative w-16 h-16">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
              No image
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div>
          <div className="font-medium">{product.name}</div>
          <div className="text-sm text-gray-500">{product.brand_name}</div>
        </div>
      </TableCell>
      <TableCell>{product.ranking?.context}</TableCell>
      <TableCell>
        <Badge variant={product.ranking?.ranking_data.mentioned ? "default" : "secondary"}>
          {product.ranking?.ranking_data.mentioned ? "Yes" : "No"}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(product.ranking?.last_analyzed || '')}</TableCell>
      <TableCell>
        <a
          href={product.product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          View Product
        </a>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return (
      <div className="pt-8">
        <div className="flex items-center justify-between pl-[5rem] pr-8">
          <h1 className="text-3xl font-bold">Loading products...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8">
        <div className="flex items-center justify-between pl-[5rem] pr-8">
          <h1 className="text-3xl font-bold">Error</h1>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="flex items-center justify-between pl-[5rem] pr-8 mb-6">
        <h1 className="text-3xl font-bold">Ranked Products ({products.length})</h1>
      </div>
      <div className="px-8 pl-[5rem]">
        {products.length === 0 ? (
          <div className="text-center text-gray-500">
            No ranked products found
          </div>
        ) : (
          <div className="rounded-md border relative">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Rank</TableHead>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead className="w-[100px]">Mentioned</TableHead>
                  <TableHead className="w-[150px]">Last Analyzed</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Real products */}
                {products.slice(0, 5).map(product => renderTableRow(product))}
                
                {/* Blurred placeholder products */}
                {PLACEHOLDER_PRODUCTS.map(product => renderTableRow(product, true))}
              </TableBody>
            </Table>
            
            {/* Premium overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent h-[200px] flex flex-col items-center justify-end pb-8">
              <div className="text-lg font-semibold mb-2">
                Unlock More Product Rankings
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Upgrade to Pro to see rankings for all products
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors font-medium">
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 