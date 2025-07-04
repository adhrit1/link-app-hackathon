import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface ProductVariant {
  id: string;
  sku: string;
  price: string;
  title: string;
  available: boolean;
}

interface ProductRanking {
  rank: number;
  context: string;
  ranking_data: {
    rank: number;
    context: string;
    mentioned: boolean;
  };
  last_analyzed: string;
}

interface ProductCardProps {
  name: string;
  description: string;
  image_url: string;
  price: string;
  compare_at_price: string | null;
  brand_name: string;
  product_url: string;
  available: boolean;
  variants: ProductVariant[];
  ranking: ProductRanking | null;
}

export default function ProductCard({
  name,
  image_url,
  brand_name,
  product_url,
  ranking,
}: ProductCardProps) {
  if (!ranking) return null; // Safety check

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="w-full max-w-sm h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="relative pb-3">
        <Badge 
          variant="secondary" 
          className="absolute top-2 right-2 z-10 text-lg font-bold"
        >
          #{ranking.rank}
        </Badge>
        <div className="aspect-square relative w-full mb-2">
          {image_url ? (
            <Image
              src={image_url}
              alt={name}
              fill
              className="object-cover rounded-lg opacity-90 hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              No image
            </div>
          )}
        </div>
        <CardTitle className="line-clamp-1 text-base">{name}</CardTitle>
        <CardDescription className="text-sm">{brand_name}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-500">Context: </span>
            <span className="font-medium">{ranking.context}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Mentioned: </span>
            <Badge variant={ranking.ranking_data.mentioned ? "default" : "secondary"}>
              {ranking.ranking_data.mentioned ? "Yes" : "No"}
            </Badge>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Last Analyzed: </span>
            <span className="text-gray-600">{formatDate(ranking.last_analyzed)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <a
          href={product_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 text-sm"
        >
          View Product
        </a>
      </CardFooter>
    </Card>
  );
} 