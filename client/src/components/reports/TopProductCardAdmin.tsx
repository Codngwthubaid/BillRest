import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Package, TrendingUp, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopProduct {
  name: string;
  quantity: number;
  totalSales: number;
}

interface TopProductCardProps {
  product: TopProduct;
  rank: number;
  currency: string;
  userEmail?: string; // 👈 added for admin reports
  userName?: string;  // 👈 optional too
}

export const TopProductCardAdmin: React.FC<TopProductCardProps> = ({
  product,
  rank,
  currency,
  userEmail,
  userName
}) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600';
      case 2: return 'from-gray-300 to-gray-500';
      case 3: return 'from-amber-600 to-amber-800';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className="h-4 w-4" />;
    return <Package className="h-4 w-4" />;
  };

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn(
              'flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br text-white font-bold text-sm',
              getRankColor(rank)
            )}
          >
            {rank <= 3 ? getRankIcon(rank) : rank}
          </div>
          <Badge variant="secondary" className="text-xs">
            #{rank}
          </Badge>
        </div>

        <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>

        {/* 👇 Show user info if provided */}
        {userEmail && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
            <User className="h-3 w-3" />
            <span>{userName ? `${userName} (${userEmail})` : userEmail}</span>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              Quantity
            </span>
            <span className="font-semibold">{product.quantity.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Revenue
            </span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {product.totalSales.toLocaleString()} {currency}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
