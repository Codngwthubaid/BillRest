import React from 'react';
import { type DivideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
    title: string;
    value: string;
    icon: typeof DivideIcon;
    trend?: string;
    trendDirection?: 'up' | 'down';
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon: Icon,
    trend,
    trendDirection,
    className
}) => {
    return (
        <Card className={cn(className)}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                        <Icon className="h-6 w-6" />
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 text-sm">
                            {trendDirection === 'up' ? (
                                <TrendingUp className="h-4 w-4" />
                            ) : (
                                <TrendingDown className="h-4 w-4" />
                            )}
                            {trend}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm opacity-90 mb-1">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
};