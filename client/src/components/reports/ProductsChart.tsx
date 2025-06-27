import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Award, TrendingUp } from 'lucide-react';
import type { ReportFilterType } from '@/services/report.service';

interface ProductsChartProps {
    data: any;
    filterType: ReportFilterType;
}

export const ProductsChart: React.FC<ProductsChartProps> = ({ data, filterType }) => {
    // Use actual product data and enhance it
    const enhancedProductData = (data?.topProducts ?? []).map((product: any = {}, index: number) => ({
        ...product,
        shortName: product?.name?.length > 20 ? product.name.substring(0, 20) + '...' : product?.name || 'N/A',
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index] || '#6b7280',
        rank: index + 1,
    }));

    const totalQuantity = enhancedProductData.reduce((sum: number, product: any) => sum + product.quantity, 0);
    const totalRevenue = enhancedProductData.reduce((sum: number, product: any) => sum + product.totalSales, 0);
    const topProduct = enhancedProductData[0];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Products Sold</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {totalQuantity.toLocaleString()}
                                </p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Product Revenue</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    ${totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Top Performer</p>
                                <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100 truncate">
                                    {topProduct?.shortName || 'N/A'}
                                </p>
                            </div>
                            <Award className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quantity Chart */}
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Product Quantities Sold
                        </CardTitle>
                        <CardDescription>
                            Units sold per product ({filterType} period)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={enhancedProductData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis
                                        type="number"
                                        className="text-xs"
                                        tick={{ fontSize: 11 }}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="shortName"
                                        className="text-xs"
                                        tick={{ fontSize: 11 }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                        formatter={(value: any) => [value.toLocaleString(), 'Quantity']}
                                        labelFormatter={(label) => enhancedProductData.find((p: any) => p.shortName === label)?.name || label}
                                    />
                                    <Bar dataKey="quantity" radius={[0, 4, 4, 0]}>
                                        {enhancedProductData.map((entry: any, index: number) => (
                                            <Cell key={`quantity-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Revenue Chart */}
                <Card className="border-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Product Revenue
                        </CardTitle>
                        <CardDescription>
                            Revenue generated per product ({filterType} period)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={enhancedProductData} layout="horizontal">
                                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                    <XAxis
                                        type="number"
                                        className="text-xs"
                                        tick={{ fontSize: 11 }}
                                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="shortName"
                                        className="text-xs"
                                        tick={{ fontSize: 11 }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
                                        labelFormatter={(label) => enhancedProductData.find((p: any) => p.shortName === label)?.name || label}
                                    />
                                    <Bar dataKey="totalSales" radius={[0, 4, 4, 0]}>
                                        {enhancedProductData.map((entry: any, index: number) => (
                                            <Cell key={`revenue-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};