import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, IndianRupee } from 'lucide-react';
import type { ReportFilterType } from '@/services/report.service';
import type { Invoice } from '@/types/invoice.types';

interface SalesChartProps {
    data: any;
    filterType: ReportFilterType;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, filterType }) => {
    
    const chartData = data?.invoices?.map((invoice: Invoice) => {
        const date = new Date(invoice.createdAt ?? 0);

        return {
            period: date.toLocaleDateString('en-US', {
                month: filterType === 'monthly' ? 'short' : undefined,
                weekday: filterType === 'daily' ? 'short' : undefined,
                day: filterType === 'daily' ? 'numeric' : undefined,
            }),
            sales: invoice.totalAmount,
            orders: invoice.products.length,
        };
    });

    const totalSales = chartData.reduce((sum: number, item: { sales: number }) => sum + item.sales, 0);
    const avgSales = chartData.length ? Math.round(totalSales / chartData.length) : 0;


    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Sales</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    <IndianRupee/>{totalSales.toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Average Sales</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    <IndianRupee/>{avgSales.toLocaleString()}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Sales Trend Over Time
                        <span className="text-sm font-normal text-muted-foreground capitalize">
                            ({filterType} view)
                        </span>
                    </CardTitle>
                    <CardDescription>
                        Track your sales performance and identify trends
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="period"
                                    className="text-xs"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value: any, name: string) => [
                                        name === 'sales' ? `₹${value.toLocaleString()}` : value,
                                        name === 'sales' ? 'Sales' : 'Orders'
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="url(#salesGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};